import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { verifyWebhookSignature } from '@/lib/lemonSqueezy/utils';
import { getDatabaseConfig } from '@/lib/config-utils';
import config from '@/config';

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

// Database handlers for different providers
const getUserDatabase = async (): Promise<UserDatabase> => {
	const { provider } = getDatabaseConfig();

	switch (provider) {
		case 'prisma': {
			const { PrismaClient } = await import('@/prisma/generated/prisma');
			const prisma = new PrismaClient();
			return {
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
		}

		case 'mongodb': {
			const { MongoClient, ObjectId } = await import('mongodb');
			const client = new MongoClient(process.env.MONGODB_URI!);
			await client.connect();
			const db = client.db(process.env.MONGODB_DATABASE);

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
							{ projection: { _id: 1, email: 1 } }
						);
					return user ? { id: user._id.toString(), email: user.email } : null;
				},
				async findUserByEmail(email: string) {
					const user = await db
						.collection('users')
						.findOne({ email }, { projection: { _id: 1, email: 1 } });
					return user ? { id: user._id.toString(), email: user.email } : null;
				},
				async createUser(email: string) {
					const result = await db.collection('users').insertOne({ email });
					return { id: result.insertedId.toString(), email };
				},
			};
		}

		case 'supabase': {
			const { createClient } = await import('@/lib/supabase/server');
			const supabase = await createClient();

			return {
				async updateUser(userId: string, data) {
					const updateData: any = {};
					if (data.customer_id !== undefined)
						updateData.customer_id = data.customer_id;
					if (data.variant_id !== undefined)
						updateData.variant_id = data.variant_id;
					if (data.has_access !== undefined)
						updateData.has_access = data.has_access;

					const { error } = await supabase
						.from('profiles')
						.update(updateData)
						.eq('id', userId);

					if (error) {
						throw new Error(`Failed to update user: ${error.message}`);
					}
				},
				async updateUsersByCustomerId(customerId: string, data) {
					const updateData: any = {};
					if (data.has_access !== undefined)
						updateData.has_access = data.has_access;

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
					const { data: user } = await supabase
						.from('profiles')
						.select('id, email')
						.eq('customer_id', customerId)
						.single();

					return user;
				},
				async findUserByEmail(email: string) {
					const { data: user } = await supabase
						.from('profiles')
						.select('id, email')
						.eq('email', email)
						.single();

					return user;
				},
				async createUser(email: string) {
					// Create user using Supabase Auth Admin
					const { data } = await supabase.auth.admin.createUser({
						email,
					});

					return data?.user
						? { id: data.user.id, email: data.user.email || email }
						: null;
				},
			};
		}

		default:
			throw new Error(`Database provider ${provider} not supported`);
	}
};

// Webhook event handlers
const handleOrderCreated = async (payload: any, db: UserDatabase) => {
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
		user = await db.findUserByEmail(email);

		if (!user) {
			// Create a new user
			user = await db.createUser(email);
		}
	} else {
		// Find user by ID - for Supabase, this would be in profiles
		user =
			(await db.findUserByCustomerId(userId)) ||
			(await db.findUserByEmail(email));
	}

	if (!user) return;

	await db.updateUser(user.id, {
		customer_id: customerId,
		variant_id: variantId,
		has_access: true,
	});
};

const handleSubscriptionCancelled = async (payload: any, db: UserDatabase) => {
	const customerId = payload.data.attributes.customer_id.toString();

	const user = await db.findUserByCustomerId(customerId);

	if (!user) return;

	await db.updateUser(user.id, {
		has_access: false,
	});
};

const webhookHandlers: Record<
	string,
	(payload: any, db: UserDatabase) => Promise<void>
> = {
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

		// Get database implementation
		const db = await getUserDatabase();

		// Process event if handler exists
		const eventHandler = webhookHandlers[eventName];
		if (eventHandler) {
			await eventHandler(payload, db);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		const err = error as Error;
		console.error(`LemonSqueezy webhook processing failed: ${err.message}`);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}
