import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/prisma/client';
import { createCheckoutSession } from '@/lib/stripe/utils';

export async function POST(req: NextRequest) {
	try {
		const userSession = await auth.api.getSession({
			headers: await headers(),
		});

		if (!userSession) {
			return NextResponse.json(
				{ error: 'Authentication required to proceed with checkout.' },
				{ status: 401 }
			);
		}

		const requestBody = await req.json();
		const { priceId, mode, successUrl, cancelUrl } = requestBody;

		// Input validation
		if (!priceId) {
			return NextResponse.json({ error: 'Price ID must be provided' }, { status: 400 });
		}
		if (!successUrl || !cancelUrl) {
			return NextResponse.json({ error: 'Both success and cancel URLs are required' }, { status: 400 });
		}
		if (!mode) {
			return NextResponse.json({
				error: "Checkout mode is required ('payment' for one-time or 'subscription' for recurring)",
			}, { status: 400 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { id: userSession.user.id },
		});

		if (!dbUser) {
			return NextResponse.json({ error: 'User record not found' }, { status: 404 });
		}

		const checkoutUrl = await createCheckoutSession({
			priceId,
			mode,
			successUrl,
			cancelUrl,
			clientReferenceId: userSession.user.id,
			customer: {
				email: userSession.user.email,
				id: dbUser.customer_id ?? undefined,
			},
		});

		return NextResponse.json({ url: checkoutUrl });
	} catch (error) {
		console.error('Checkout session creation failed:', error);
		return NextResponse.json({ error: (error as Error)?.message }, { status: 500 });
	}
}
