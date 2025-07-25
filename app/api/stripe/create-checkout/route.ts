import { NextResponse, type NextRequest } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/utils';
import { getDatabaseConfig, getAuthConfig } from '@/lib/config-utils';

// Simple user data interface
interface User {
	id: string;
	email: string;
	customer_id?: string;
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
					{ projection: { _id: 1, email: 1, customer_id: 1 } }
				);

			await client.close();
			return user
				? {
						id: user._id.toString(),
						email: user.email,
						customer_id: user.customer_id || undefined,
					}
				: null;
		}

		case 'supabase': {
			const { createClient } = await import('@/lib/supabase/server');
			const supabase = await createClient();

			// Try to find existing profile
			const { data: profile } = await supabase
				.from('profiles')
				.select('id, email, customer_id')
				.eq('id', userId)
				.single();

			// If no profile exists, create one with email from auth
			if (!profile) {
				const {
					data: { user: authUser },
				} = await supabase.auth.getUser();

				const { data: newProfile, error } = await supabase
					.from('profiles')
					.insert([{ id: userId, email: authUser?.email }])
					.select('id, email, customer_id')
					.single();

				if (error) {
					console.error('Failed to create profile:', error);
					throw new Error('Failed to create user profile');
				}

				return newProfile;
			}

			return profile;
		}

		default:
			throw new Error(`Database provider ${provider} not supported`);
	}
};

/**
 * Create Stripe checkout session
 * Supports all auth and database providers
 */
export async function POST(req: NextRequest) {
	try {
		// Get user session from configured auth provider
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
