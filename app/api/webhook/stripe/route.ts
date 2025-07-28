import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import {
	retrieveCheckoutSession,
	verifyWebhookSignature,
} from '@/lib/stripe/utils';
import { ObjectId } from 'mongodb';
import { mongo } from '@/lib/db/mongodb/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-06-30.basil',
	typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

const getUserDatabase = (): UserDatabase => {
	const db = mongo.db(process.env.MONGODB_DATABASE);

	return {
		async updateUser(userId: string, data) {
			await db
				.collection('users')
				.updateOne({ _id: new ObjectId(userId) }, { $set: data });
		},
		async updateUsersByCustomerId(customerId: string, data) {
			await db
				.collection('users')
				.updateMany({ customer_id: customerId }, { $set: data });
		},
		async findUserByCustomerId(customerId: string) {
			const user = await db
				.collection('users')
				.findOne(
					{ customer_id: customerId },
					{ projection: { _id: 1, price_id: 1 } }
				);

			return user ? { id: user._id.toString(), price_id: user.price_id } : null;
		},
	};
};

const handleCheckoutCompleted = async (
	event: Stripe.Event,
	db: UserDatabase
) => {
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

const handleSubscriptionDeleted = async (
	event: Stripe.Event,
	db: UserDatabase
) => {
	const subscriptionData = event.data.object as Stripe.Subscription;
	const subscription = await stripe.subscriptions.retrieve(subscriptionData.id);

	await db.updateUsersByCustomerId(subscription.customer as string, {
		has_access: false,
	});
};

const handleInvoicePaid = async (event: Stripe.Event, db: UserDatabase) => {
	const invoiceData = event.data.object as Stripe.Invoice;
	const lineItem = invoiceData.lines.data[0];
	const priceId = lineItem?.pricing?.price_details?.price;
	const customerId = invoiceData.customer as string;

	if (!customerId || !priceId) return;

	const user = await db.findUserByCustomerId(customerId);

	if (!user || user.price_id !== priceId) return;

	await db.updateUser(user.id, { has_access: true });
};

const webhookHandlers: Record<
	string,
	(event: Stripe.Event, db: UserDatabase) => Promise<void>
> = {
	'checkout.session.completed': handleCheckoutCompleted,
	'customer.subscription.deleted': handleSubscriptionDeleted,
	'invoice.paid': handleInvoicePaid,
	'checkout.session.expired': async () => {},
	'customer.subscription.updated': async () => {},
	'invoice.payment_failed': async () => {},
};

export async function POST(req: NextRequest) {
	try {
		const rawPayload = await req.text();
		const headersList = await headers();
		const webhookSignature = headersList.get('stripe-signature');

		if (!webhookSignature) {
			return NextResponse.json(
				{ error: 'Missing stripe signature' },
				{ status: 400 }
			);
		}

		const webhookEvent = verifyWebhookSignature(
			rawPayload,
			webhookSignature,
			webhookSecret
		);

		if (!webhookEvent) {
			return NextResponse.json(
				{ error: 'Invalid webhook signature' },
				{ status: 400 }
			);
		}

		const db = getUserDatabase();

		const eventHandler = webhookHandlers[webhookEvent.type];
		if (eventHandler) {
			await eventHandler(webhookEvent, db);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		const err = error as Error;
		console.error(`Webhook processing failed: ${err.message}`);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}
