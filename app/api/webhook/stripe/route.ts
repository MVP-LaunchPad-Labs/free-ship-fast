import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { retrieveCheckoutSession } from "@/lib/stripe/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-06-30.basil",
	typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Database abstraction layer
interface UserDatabase {
	updateUser(
		userId: string,
		data: { customer_id?: string; price_id?: string; has_access?: boolean },
	): Promise<void>;
	updateUsersByCustomerId(
		customerId: string,
		data: { has_access?: boolean },
	): Promise<void>;
	findUserByCustomerId(
		customerId: string,
	): Promise<{ id: string; price_id?: string } | null>;
}

// Import the appropriate database implementation
// For Prisma:
import { prisma } from "@/lib/db/prisma/client";
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

// For MongoDB (uncomment when needed):
/*
import { mongo } from '@/lib/db/mongodb/client';
const mongoDb: UserDatabase = {
	async updateUser(userId: string, data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db.collection('users').updateOne(
			{ _id: userId },
			{ $set: data }
		);
	},
	async updateUsersByCustomerId(customerId: string, data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db.collection('users').updateMany(
			{ customer_id: customerId },
			{ $set: data }
		);
	},
	async findUserByCustomerId(customerId: string) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		const user = await db.collection('users').findOne(
			{ customer_id: customerId },
			{ projection: { _id: 1, price_id: 1 } }
		);
		return user ? { id: user._id, price_id: user.price_id } : null;
	},
};
*/

// Choose database implementation
const db: UserDatabase = prismaDb; // Switch to mongoDb when using MongoDB

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
		"checkout.session.completed": handleCheckoutCompleted,
		"customer.subscription.deleted": handleSubscriptionDeleted,
		"invoice.paid": handleInvoicePaid,
		// Acknowledge but don't process these events
		"checkout.session.expired": async () => {},
		"customer.subscription.updated": async () => {},
		"invoice.payment_failed": async () => {},
	};

export async function POST(req: NextRequest) {
	try {
		const requestBody = await req.text();
		const headersList = await headers();
		const stripeSignature = headersList.get("stripe-signature");

		if (!stripeSignature) {
			return NextResponse.json(
				{ error: "Missing stripe signature" },
				{ status: 400 },
			);
		}

		// Verify webhook authenticity
		const webhookEvent = stripe.webhooks.constructEvent(
			requestBody,
			stripeSignature,
			webhookSecret,
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
