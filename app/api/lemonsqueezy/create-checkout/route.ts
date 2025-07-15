import { createCheckoutSession } from '@/lib/lemonSqueezy/utils';
import { getDatabaseConfig, getAuthConfig } from '@/lib/config-utils';
import { NextRequest, NextResponse } from 'next/server';

// Simple user data interface
interface User {
	id: string;
	email: string;
}

// Auth handlers for different providers
const getAuthSession = async (req: NextRequest) => {
	const { provider } = getAuthConfig();

	switch (provider) {
		case 'better-auth': {
			const { auth } = await import('@/lib/auth');
			return await auth.api.getSession({ headers: req.headers });
		}
		case 'supabase': {
			const { createClient } = await import('@/lib/supabase/server');
			const supabase = await createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			return user ? { user: { id: user.id, email: user.email } } : null;
		}
		default:
			return null;
	}
};

// Database handlers for different providers
const getUserFromDatabase = async (userId: string): Promise<User | null> => {
	const { provider } = getDatabaseConfig();

	switch (provider) {
		case 'prisma': {
			const { PrismaClient } = await import('@/prisma/generated/prisma');
			const prisma = new PrismaClient();
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, email: true },
			});
			await prisma.$disconnect();
			return user;
		}

		case 'mongodb': {
			const { MongoClient, ObjectId } = await import('mongodb');
			const client = new MongoClient(process.env.MONGODB_URI!);
			await client.connect();

			const db = client.db(process.env.MONGODB_DATABASE);
			const user = await db
				.collection('users')
				.findOne(
					{ _id: new ObjectId(userId) },
					{ projection: { _id: 1, email: 1 } }
				);

			await client.close();
			return user ? { id: user._id.toString(), email: user.email } : null;
		}

		case 'supabase': {
			const { createClient } = await import('@/lib/supabase/server');
			const supabase = await createClient();
			const { data: user } = await supabase
				.from('profiles')
				.select('id, email')
				.eq('id', userId)
				.single();

			return user;
		}

		default:
			throw new Error(`Database provider ${provider} not supported`);
	}
};

/**
 * Create LemonSqueezy checkout session
 * Supports all auth and database providers
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

		// Get user session from configured auth provider
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
