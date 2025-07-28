import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { verifyWebhookSignature } from '@/lib/lemonSqueezy/utils';
import { ObjectId } from 'mongodb';
import { mongo } from '@/lib/db/mongodb/client';
import config from '@/config';

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
			const result = await db.collection('users').insertOne({
				email,
				name: email.split('@')[0],
				emailVerified: false,
				createdAt: new Date(),
			});

			return { id: result.insertedId.toString(), email };
		},
	};
};

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
		user = await db.findUserByEmail(email);

		if (!user) {
			user = await db.createUser(email);
		}
	} else {
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

		const isValid = verifyWebhookSignature(rawPayload, webhookSignature);

		if (!isValid) {
			return NextResponse.json(
				{ error: 'Invalid webhook signature' },
				{ status: 400 }
			);
		}

		const payload = JSON.parse(rawPayload);
		const eventName = payload.meta.event_name;

		const db = getUserDatabase();

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
