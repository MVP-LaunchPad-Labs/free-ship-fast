import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/client';

// This route is used to store the waitlist that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		if (!body.email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		const supabase = createClient();

		// Check for duplicate email to prevent spam
		const { data: existingWaitlist } = await supabase
			.from('waitlist')
			.select('email')
			.eq('email', body.email)
			.single();

		if (existingWaitlist) {
			return NextResponse.json(
				{ error: 'Email already registered' },
				{ status: 409 }
			);
		}

		// Get IP and user agent for spam prevention
		const headersList = await headers();
		const ip =
			headersList.get('x-forwarded-for') ||
			headersList.get('x-real-ip') ||
			'unknown';
		const userAgent = headersList.get('user-agent') || 'unknown';

		// Insert with timestamp and spam prevention data
		const { error } = await supabase.from('waitlist').insert([
			{
				email: body.email,
				created_at: new Date().toISOString(),
				ip,
				user_agent: userAgent,
			},
		]);

		if (error) {
			throw new Error(`Failed to create waitlist entry: ${error.message}`);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Waitlist submission error:', error);
		return NextResponse.json(
			{
				error: (error as Error)?.message || 'Internal server error',
			},
			{ status: 500 }
		);
	}
}
