import { NextResponse, type NextRequest } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/utils';
import { createClient } from '@/lib/supabase/server';

// Simple user data interface
interface User {
	id: string;
	email: string;
	customer_id?: string;
}

// Get user session from Supabase
const getAuthSession = async (req: NextRequest) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user ? { user: { id: user.id, email: user.email } } : null;
};

// Get user from Supabase database
const getUserFromDatabase = async (userId: string): Promise<User | null> => {
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
};

/**
 * Create Stripe checkout session
 * Uses Supabase for authentication and database
 */
export async function POST(req: NextRequest) {
	try {
		// Get user session from Supabase
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
