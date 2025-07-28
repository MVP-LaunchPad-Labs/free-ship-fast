import { createCheckoutSession } from '@/lib/lemonSqueezy/utils';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Simple user data interface
interface User {
	id: string;
	email: string;
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
	const { data: user } = await supabase
		.from('profiles')
		.select('id, email')
		.eq('id', userId)
		.single();

	return user;
};

/**
 * Create LemonSqueezy checkout session
 * Uses Supabase for authentication and database
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

		// Get user session from Supabase
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
