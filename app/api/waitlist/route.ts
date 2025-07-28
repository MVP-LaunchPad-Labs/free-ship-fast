import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { mongo } from '@/lib/db/mongodb/client';

interface WaitlistDatabase {
	findWaitlistByEmail(email: string): Promise<{ email: string } | null>;
	createWaitlist(data: {
		email: string;
		createdAt: Date;
		ip: string;
		userAgent: string;
	}): Promise<void>;
}

const mongoDb: WaitlistDatabase = {
	async findWaitlistByEmail(email: string) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		const waitlist = await db
			.collection('waitlist')
			.findOne({ email }, { projection: { email: 1 } });
		return waitlist ? { email: waitlist.email } : null;
	},
	async createWaitlist(data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db.collection('waitlist').insertOne(data);
	},
};

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		if (!body.email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return NextResponse.json(
				{ error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		const existingWaitlist = await mongoDb.findWaitlistByEmail(body.email);
		if (existingWaitlist) {
			return NextResponse.json(
				{ error: 'Email already registered' },
				{ status: 409 }
			);
		}

		const headersList = await headers();
		const ip =
			headersList.get('x-forwarded-for') ||
			headersList.get('x-real-ip') ||
			'unknown';
		const userAgent = headersList.get('user-agent') || 'unknown';

		await mongoDb.createWaitlist({
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
