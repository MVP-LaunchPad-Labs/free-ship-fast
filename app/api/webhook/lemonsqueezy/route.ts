import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { verifyWebhookSignature } from '@/lib/lemonSqueezy/utils';
import { PrismaClient } from '@/prisma/generated/prisma';
import config from '@/config';

const prisma = new PrismaClient();

// Database abstraction layer
interface UserDatabase {
	updateUser(
		userId: string,
		data: { customer_id?: string; variant_id?: string; has_access?: boolean }
	): Promise<void>;
	updateUsersByCustomerId(
		customerId: string,
		data: { has_access?: boolean }
	): Promise<void>;
	findUserByCustomerId(
		customerId: string
	): Promise<{ id: string; email?: string } | null>;
	findUserByEmail(email: string): Promise<{ id: string; email: string } | null>;
	createUser(email: string): Promise<{ id: string; email: string } | null>;
}

// Prisma implementation
const userDatabase: UserDatabase = {
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
			select: { id: true, email: true },
		});
		return user;
	},
	async findUserByEmail(email: string) {
		const user = await prisma.user.findFirst({
			where: { email },
			select: { id: true, email: true },
		});
		return user;
	},
	async createUser(email: string) {
		// Generate a unique ID for the user
		const userId = crypto.randomUUID();
		const user = await prisma.user.create({
			data: {
				id: userId,
				email,
				name: email.split('@')[0], // Use email prefix as name
				emailVerified: false,
			},
			select: { id: true, email: true },
		});
		return user;
	},
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
		user = await userDatabase.findUserByEmail(email);

		if (!user) {
			// Create a new user
			user = await userDatabase.createUser(email);
		}
	} else {
		// Find user by ID
		user =
			(await userDatabase.findUserByCustomerId(userId)) ||
			(await userDatabase.findUserByEmail(email));
	}

	if (!user) return;

	await userDatabase.updateUser(user.id, {
		customer_id: customerId,
		variant_id: variantId,
		has_access: true,
	});
};

const handleSubscriptionCancelled = async (payload: any) => {
	const customerId = payload.data.attributes.customer_id.toString();

	const user = await userDatabase.findUserByCustomerId(customerId);

	if (!user) return;

	await userDatabase.updateUser(user.id, {
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
	} finally {
		await prisma.$disconnect();
	}
}
