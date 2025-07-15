import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { retrieveCheckoutSession } from '@/lib/stripe/utils';
import { getDatabaseConfig } from '@/lib/config-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-06-30.basil',
	typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Database abstraction layer
interface UserDatabase {
	updateUser(
		userId: string,
		data: { customer_id?: string; price_id?: string; has_access?: boolean }
	): Promise<void>;
	updateUsersByCustomerId(
		customerId: string,
		data: { has_access?: boolean }
	): Promise<void>;
	findUserByCustomerId(
		customerId: string
	): Promise<{ id: string; price_id?: string } | null>;
}

// Import the appropriate database implementation
// For Prisma:
import { prisma } from '@/lib/db/prisma/client';
const prismaDb: UserDatabase = {
	async updateUser(userId: string, data) {
		await prisma.user.update({
			where: { id: userId },
			data,
		});
	},
	async updateUsersByCustomerId(customerId: string, data) {
		await prisma.user.updateMany({
			where: { customer_id: customerId },
			data,
		});
	},
	async findUserByCustomerId(customerId: string) {
		const user = await prisma.user.findFirst({
			where: { customer_id: customerId },
			select: { id: true, price_id: true },
		});
		return user ? { id: user.id, price_id: user.price_id || undefined } : null;
	},
};

// For MongoDB:
import { mongo } from '@/lib/db/mongodb/client';
import { ObjectId } from 'mongodb';
const mongoDb: UserDatabase = {
	async updateUser(userId: string, data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db
			.collection('users')
			.updateOne({ _id: new ObjectId(userId) }, { $set: data });
	},
	async updateUsersByCustomerId(customerId: string, data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db
			.collection('users')
			.updateMany({ customer_id: customerId }, { $set: data });
	},
	async findUserByCustomerId(customerId: string) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		const user = await db
			.collection('users')
			.findOne(
				{ customer_id: customerId },
				{ projection: { _id: 1, price_id: 1 } }
			);
		return user ? { id: user._id.toString(), price_id: user.price_id } : null;
	},
};

// For Supabase:
import { createClient } from '@/lib/supabase/client';
const supabaseDb: UserDatabase = {
	async updateUser(userId: string, data) {
		const supabase = createClient();

		// Convert data keys to match Supabase naming
		const updateData: any = {};
		if (data.customer_id !== undefined)
			updateData.customer_id = data.customer_id;
		if (data.price_id !== undefined) updateData.price_id = data.price_id;
		if (data.has_access !== undefined) updateData.has_access = data.has_access;

		const { error } = await supabase
			.from('profiles')
			.update(updateData)
			.eq('id', userId);

		if (error) {
			throw new Error(`Failed to update user: ${error.message}`);
		}
	},
	async updateUsersByCustomerId(customerId: string, data) {
		const supabase = createClient();

		const updateData: any = {};
		if (data.has_access !== undefined) updateData.has_access = data.has_access;

		const { error } = await supabase
			.from('profiles')
			.update(updateData)
			.eq('customer_id', customerId);

		if (error) {
			throw new Error(
				`Failed to update users by customer ID: ${error.message}`
			);
		}
	},
	async findUserByCustomerId(customerId: string) {
		const supabase = createClient();
		const { data: user } = await supabase
			.from('profiles')
			.select('id, price_id')
			.eq('customer_id', customerId)
			.single();

		return user ? { id: user.id, price_id: user.price_id || undefined } : null;
	},
};

// Automatically choose database implementation based on config
const getDatabaseImplementation = (): UserDatabase => {
	const { provider } = getDatabaseConfig();

	switch (provider) {
		case 'prisma':
			return prismaDb;
		case 'mongodb':
			return mongoDb;
		case 'supabase':
			return supabaseDb;
		default:
			throw new Error(`Database provider ${provider} not implemented`);
	}
};

const db: UserDatabase = getDatabaseImplementation();

// Webhook event handlers
const handleCheckoutCompleted = async (event: Stripe.Event) => {
	const sessionData = event.data.object as Stripe.Checkout.Session;
	const sessionDetails = await retrieveCheckoutSession(sessionData.id);

	const customerId = sessionDetails?.customer as string;
	const priceId = sessionDetails?.line_items?.data[0]?.price?.id;
	const userId = sessionData.client_reference_id;

	if (!userId || !customerId || !priceId) return;

	await db.updateUser(userId, {
		customer_id: customerId,
		price_id: priceId,
		has_access: true,
	});
};

const handleSubscriptionDeleted = async (event: Stripe.Event) => {
	const subscriptionData = event.data.object as Stripe.Subscription;
	const subscription = await stripe.subscriptions.retrieve(subscriptionData.id);

	await db.updateUsersByCustomerId(subscription.customer as string, {
		has_access: false,
	});
};

const handleInvoicePaid = async (event: Stripe.Event) => {
	const invoiceData = event.data.object as Stripe.Invoice;
	const lineItem = invoiceData.lines.data[0];
	const priceId = lineItem?.pricing?.price_details?.price;
	const customerId = invoiceData.customer as string;

	if (!customerId || !priceId) return;

	const user = await db.findUserByCustomerId(customerId);

	if (!user || user.price_id !== priceId) return;

	await db.updateUser(user.id, { has_access: true });
};

const webhookHandlers: Record<string, (event: Stripe.Event) => Promise<void>> =
	{
		'checkout.session.completed': handleCheckoutCompleted,
		'customer.subscription.deleted': handleSubscriptionDeleted,
		'invoice.paid': handleInvoicePaid,
		// Acknowledge but don't process these events
		'checkout.session.expired': async () => {},
		'customer.subscription.updated': async () => {},
		'invoice.payment_failed': async () => {},
	};

export async function POST(req: NextRequest) {
	try {
		const requestBody = await req.text();
		const headersList = await headers();
		const stripeSignature = headersList.get('stripe-signature');

		if (!stripeSignature) {
			return NextResponse.json(
				{ error: 'Missing stripe signature' },
				{ status: 400 }
			);
		}

		// Verify webhook authenticity
		const webhookEvent = stripe.webhooks.constructEvent(
			requestBody,
			stripeSignature,
			webhookSecret
		);

		// Process event if handler exists
		const eventHandler = webhookHandlers[webhookEvent.type];
		if (eventHandler) {
			await eventHandler(webhookEvent);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		const err = error as Error;
		console.error(`Webhook processing failed: ${err.message}`);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}
