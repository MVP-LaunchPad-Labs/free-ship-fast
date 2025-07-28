import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { verifyWebhookSignature } from '@/lib/lemonSqueezy/utils';
import { createClient } from '@/lib/supabase/server';
import config from '@/config';

// Database handlers for Supabase
const updateUser = async (
	userId: string,
	data: { customer_id?: string; variant_id?: string; has_access?: boolean }
) => {
	const supabase = await createClient();
	const updateData: any = {};
	if (data.customer_id !== undefined) updateData.customer_id = data.customer_id;
	if (data.variant_id !== undefined) updateData.variant_id = data.variant_id;
	if (data.has_access !== undefined) updateData.has_access = data.has_access;

	const { error } = await supabase
		.from('profiles')
		.update(updateData)
		.eq('id', userId);

	if (error) {
		throw new Error(`Failed to update user: ${error.message}`);
	}
};

const findUserByCustomerId = async (customerId: string) => {
	const supabase = await createClient();
	const { data: user } = await supabase
		.from('profiles')
		.select('id, email')
		.eq('customer_id', customerId)
		.single();

	return user;
};

const findUserByEmail = async (email: string) => {
	const supabase = await createClient();
	const { data: user } = await supabase
		.from('profiles')
		.select('id, email')
		.eq('email', email)
		.single();

	return user;
};

const createUser = async (email: string) => {
	const supabase = await createClient();
	// Create user using Supabase Auth Admin
	const { data } = await supabase.auth.admin.createUser({
		email,
	});

	return data?.user
		? { id: data.user.id, email: data.user.email || email }
		: null;
};

// Webhook event handlers
const handleOrderCreated = async (payload: any) => {
	const customerId = payload.data.attributes.customer_id.toString();
	const userId = payload.meta?.custom_data?.userId;
	const email = payload.data.attributes.user_email;
	const variantId =
		payload.data.attributes.first_order_item.variant_id.toString();

	const lemonsqueezyConfig = config.payment.lemonsqueezy;
	if (!lemonsqueezyConfig) {
		console.error('LemonSqueezy configuration not found');
		return;
	}

	const plan = lemonsqueezyConfig.plans.find(
		(p: any) => p.variantId === variantId
	);

	if (!plan) return;

	let user;
	if (!userId) {
		// Check if user already exists
		user = await findUserByEmail(email);

		if (!user) {
			// Create a new user
			user = await createUser(email);
		}
	} else {
		// Find user by ID - for Supabase, this would be in profiles
		user =
			(await findUserByCustomerId(userId)) || (await findUserByEmail(email));
	}

	if (!user) return;

	await updateUser(user.id, {
		customer_id: customerId,
		variant_id: variantId,
		has_access: true,
	});
};

const handleSubscriptionCancelled = async (payload: any) => {
	const customerId = payload.data.attributes.customer_id.toString();

	const user = await findUserByCustomerId(customerId);

	if (!user) return;

	await updateUser(user.id, {
		has_access: false,
	});
};

const webhookHandlers: Record<string, (payload: any) => Promise<void>> = {
	order_created: handleOrderCreated,
	subscription_cancelled: handleSubscriptionCancelled,
};

export async function POST(req: NextRequest) {
	try {
		const rawPayload = await req.text();
		const headersList = await headers();
		const webhookSignature = headersList.get('x-signature');

		if (!webhookSignature) {
			return NextResponse.json(
				{ error: 'Missing webhook signature' },
				{ status: 400 }
			);
		}

		// Verify webhook authenticity using utility function
		const isValid = verifyWebhookSignature(rawPayload, webhookSignature);

		if (!isValid) {
			return NextResponse.json(
				{ error: 'Invalid webhook signature' },
				{ status: 400 }
			);
		}

		// Parse the payload
		const payload = JSON.parse(rawPayload);
		const eventName = payload.meta.event_name;

		// Process event if handler exists
		const eventHandler = webhookHandlers[eventName];
		if (eventHandler) {
			await eventHandler(payload);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		const err = error as Error;
		console.error(`LemonSqueezy webhook processing failed: ${err.message}`);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}
