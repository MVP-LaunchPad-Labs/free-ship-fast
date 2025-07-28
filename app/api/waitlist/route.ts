import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma/client';

// Database abstraction layer
interface WaitlistDatabase {
	findWaitlistByEmail(email: string): Promise<{ email: string } | null>;
	createWaitlist(data: {
		email: string;
		createdAt: Date;
		ip: string;
		userAgent: string;
	}): Promise<void>;
}

// Prisma implementation
const prismaDb: WaitlistDatabase = {
	async findWaitlistByEmail(email: string) {
		const waitlist = await prisma.waitlist.findUnique({
			where: { email },
			select: { email: true },
		});
		return waitlist;
	},
	async createWaitlist(data) {
		await prisma.waitlist.create({
			data,
		});
	},
};

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

		// Check for duplicate email to prevent spam
		const existingWaitlist = await prismaDb.findWaitlistByEmail(body.email);
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
		await prismaDb.createWaitlist({
			email: body.email,
			createdAt: new Date(),
			ip,
			userAgent,
		});

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
