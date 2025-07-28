import { NextResponse, type NextRequest } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/utils';
import { ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { mongo } from '@/lib/db/mongodb/client';

interface User {
	id: string;
	email: string;
	customer_id?: string;
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
			{ projection: { _id: 1, email: 1, customer_id: 1 } }
		);

	return user
		? {
				id: user._id.toString(),
				email: user.email,
				customer_id: user.customer_id || undefined,
			}
		: null;
};

/**
 * Create Stripe checkout session
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getAuthSession(req);

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { priceId, mode, successUrl, cancelUrl } = body;

		if (!priceId) {
			return NextResponse.json(
				{ error: 'Price ID is required' },
				{ status: 400 }
			);
		}

		if (!successUrl || !cancelUrl) {
			return NextResponse.json(
				{ error: 'Success and cancel URLs are required' },
				{ status: 400 }
			);
		}

		if (!mode) {
			return NextResponse.json(
				{ error: 'Checkout mode is required' },
				{ status: 400 }
			);
		}

		const user = await getUserFromDatabase(session.user.id);

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const checkoutUrl = await createCheckoutSession({
			priceId,
			mode,
			successUrl,
			cancelUrl,
			clientReferenceId: user.id,
			customer: {
				email: user.email,
				id: user.customer_id,
			},
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
