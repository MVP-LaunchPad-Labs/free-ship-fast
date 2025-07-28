import { NextResponse, type NextRequest } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/utils';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@/prisma/generated/prisma';

// Simple user data interface
interface User {
	id: string;
	email: string;
	customer_id?: string;
}

const prisma = new PrismaClient();

// Auth handler for Better Auth
const getAuthSession = async (req: NextRequest) => {
	return await auth.api.getSession({ headers: req.headers });
};

// Database handler for Prisma
const getUserFromDatabase = async (userId: string): Promise<User | null> => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, email: true, customer_id: true },
	});
	await prisma.$disconnect();
	return user
		? {
				id: user.id,
				email: user.email,
				customer_id: user.customer_id || undefined,
			}
		: null;
};

/**
 * Create Stripe checkout session
 * Uses Prisma database and Better Auth
 */
export async function POST(req: NextRequest) {
	try {
		// Get user session from Better Auth
		const session = await getAuthSession(req);

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { priceId, mode, successUrl, cancelUrl } = body;

		// Validate required fields
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

		// Get user from database
		const user = await getUserFromDatabase(session.user.id);

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Create checkout session
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
