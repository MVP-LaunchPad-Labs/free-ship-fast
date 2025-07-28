import { createCheckoutSession } from '@/lib/lemonSqueezy/utils';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { mongo } from '@/lib/db/mongodb/client';

interface User {
	id: string;
	email: string;
}

const getAuthSession = async (req: NextRequest) => {
	return await auth.api.getSession({ headers: req.headers });
};

const getUserFromDatabase = async (userId: string): Promise<User | null> => {
	const db = mongo.db(process.env.MONGODB_DATABASE);
	const user = await db
		.collection('users')
		.findOne(
			{ _id: new ObjectId(userId) },
			{ projection: { _id: 1, email: 1 } }
		);

	return user ? { id: user._id.toString(), email: user.email } : null;
};

/**
 * Create LemonSqueezy checkout session
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { variantId, successUrl, cancelUrl, discountCode } = body;

		if (!variantId) {
			return NextResponse.json(
				{ error: 'Variant ID is required' },
				{ status: 400 }
			);
		}

		if (!successUrl) {
			return NextResponse.json(
				{ error: 'Success URL is required' },
				{ status: 400 }
			);
		}

		const session = await getAuthSession(req);

		let userId: string | undefined;
		let userEmail: string | undefined;

		if (session?.user?.id) {
			try {
				const user = await getUserFromDatabase(session.user.id);
				if (user) {
					userId = user.id;
					userEmail = user.email;
				}
			} catch (error) {
				console.error('Failed to fetch user:', error);
			}
		}

		const checkoutUrl = await createCheckoutSession({
			variantId,
			successUrl,
			cancelUrl,
			userId,
			email: userEmail,
			discountCode,
		});

		if (!checkoutUrl) {
			return NextResponse.json(
				{ error: 'Failed to create checkout' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ url: checkoutUrl });
	} catch (error) {
		console.error('Checkout error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
