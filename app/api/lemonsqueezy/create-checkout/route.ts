import { createCheckoutSession } from '@/lib/lemonSqueezy/utils';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/prisma/generated/prisma';

// Simple user data interface
interface User {
	id: string;
	email: string;
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
		select: { id: true, email: true },
	});
	await prisma.$disconnect();
	return user;
};

/**
 * Create LemonSqueezy checkout session
 * Uses Prisma database and Better Auth
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { variantId, successUrl, cancelUrl, discountCode } = body;

		// Validate required fields
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

		// Get user session from Better Auth
		const session = await getAuthSession(req);

		let userId: string | undefined;
		let userEmail: string | undefined;

		// If user is logged in, get their data
		if (session?.user?.id) {
			try {
				const user = await getUserFromDatabase(session.user.id);
				if (user) {
					userId = user.id;
					userEmail = user.email;
				}
			} catch (error) {
				console.error('Failed to fetch user:', error);
				// Continue without user data - checkout still works
			}
		}

		// Create checkout session
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
