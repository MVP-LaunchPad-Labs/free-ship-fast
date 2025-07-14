import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

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

// Import the appropriate database implementation
// For Prisma:
import { prisma } from '@/lib/db/prisma/client';
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

// For MongoDB (uncomment when needed):
/*
import { mongo } from '@/lib/db/mongodb/client';
const mongoDb: WaitlistDatabase = {
	async findWaitlistByEmail(email: string) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		const waitlist = await db.collection('waitlist').findOne(
			{ email },
			{ projection: { email: 1 } }
		);
		return waitlist ? { email: waitlist.email } : null;
	},
	async createWaitlist(data) {
		const db = mongo.db(process.env.MONGODB_DATABASE);
		await db.collection('waitlist').insertOne(data);
	},
};
*/

// Choose database implementation
const db: WaitlistDatabase = prismaDb; // Switch to mongoDb when using MongoDB

// This route is used to store the waitlist that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		if (!body.email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		// Check for duplicate email to prevent spam
		const existingWaitlist = await db.findWaitlistByEmail(body.email);
		if (existingWaitlist) {
			return NextResponse.json({ error: "Email already registered" }, { status: 409 });
		}

		// Get IP and user agent for spam prevention
		const headersList = await headers();
		const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
		const userAgent = headersList.get('user-agent') || 'unknown';

		// Insert with timestamp and spam prevention data
		await db.createWaitlist({
			email: body.email,
			createdAt: new Date(),
			ip,
			userAgent,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Waitlist submission error:', error);
		return NextResponse.json({
			error: (error as Error)?.message || "Internal server error"
		}, { status: 500 });
	}
}
