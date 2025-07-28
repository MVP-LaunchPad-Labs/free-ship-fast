import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import {
	retrieveCheckoutSession,
	verifyWebhookSignature,
} from '@/lib/stripe/utils';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-06-30.basil',
	typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Database handler for Supabase
const updateUser = async (
	userId: string,
	data: { customer_id?: string; price_id?: string; has_access?: boolean }
) => {
	const supabase = await createClient();
	const updateData: any = {};
	if (data.customer_id !== undefined) updateData.customer_id = data.customer_id;
	if (data.price_id !== undefined) updateData.price_id = data.price_id;
	if (data.has_access !== undefined) updateData.has_access = data.has_access;

	const { error } = await supabase
		.from('profiles')
		.update(updateData)
		.eq('id', userId);

	if (error) {
		throw new Error(`Failed to update user: ${error.message}`);
	}
};

const updateUsersByCustomerId = async (
	customerId: string,
	data: { has_access?: boolean }
) => {
	const supabase = await createClient();
	const updateData: any = {};
	if (data.has_access !== undefined) updateData.has_access = data.has_access;

	const { error } = await supabase
		.from('profiles')
		.update(updateData)
		.eq('customer_id', customerId);

	if (error) {
		throw new Error(`Failed to update users by customer ID: ${error.message}`);
	}
};

const findUserByCustomerId = async (customerId: string) => {
	const supabase = await createClient();
	const { data: user } = await supabase
		.from('profiles')
		.select('id, price_id')
		.eq('customer_id', customerId)
		.single();

	return user ? { id: user.id, price_id: user.price_id || undefined } : null;
};

// Webhook event handlers
const handleCheckoutCompleted = async (event: Stripe.Event) => {
	const sessionData = event.data.object as Stripe.Checkout.Session;
	const sessionDetails = await retrieveCheckoutSession(sessionData.id);

	const customerId = sessionDetails?.customer as string;
	const priceId = sessionDetails?.line_items?.data[0]?.price?.id;
	const userId = sessionData.client_reference_id;

	if (!userId || !customerId || !priceId) return;

	await updateUser(userId, {
		customer_id: customerId,
		price_id: priceId,
		has_access: true,
	});
};

const handleSubscriptionDeleted = async (event: Stripe.Event) => {
	const subscriptionData = event.data.object as Stripe.Subscription;
	const subscription = await stripe.subscriptions.retrieve(subscriptionData.id);

	await updateUsersByCustomerId(subscription.customer as string, {
		has_access: false,
	});
};

const handleInvoicePaid = async (event: Stripe.Event) => {
	const invoiceData = event.data.object as Stripe.Invoice;
	const lineItem = invoiceData.lines.data[0];
	const priceId = lineItem?.pricing?.price_details?.price;
	const customerId = invoiceData.customer as string;

	if (!customerId || !priceId) return;

	const user = await findUserByCustomerId(customerId);

	if (!user || user.price_id !== priceId) return;

	await updateUser(user.id, { has_access: true });
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
		const rawPayload = await req.text();
		const headersList = await headers();
		const webhookSignature = headersList.get('stripe-signature');

		if (!webhookSignature) {
			return NextResponse.json(
				{ error: 'Missing stripe signature' },
				{ status: 400 }
			);
		}

		// Verify webhook authenticity using utility function
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
