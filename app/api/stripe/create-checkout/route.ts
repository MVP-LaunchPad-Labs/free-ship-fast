import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { createCheckoutSession } from '@/lib/stripe/utils';
import { getDatabaseConfig } from '@/lib/config-utils';

// Database abstraction layer
interface UserDatabase {
	findUserById(
		userId: string
	): Promise<{ id: string; customer_id?: string } | null>;
}

// Import the appropriate database implementation
// For Prisma:
import { prisma } from '@/lib/db/prisma/client';
const prismaDb: UserDatabase = {
	async findUserById(userId: string) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, customer_id: true },
		});
		return user
			? { id: user.id, customer_id: user.customer_id || undefined }
			: null;
	},
};

// For MongoDB:
import { mongo } from '@/lib/db/mongodb/client';
import { ObjectId } from 'mongodb';
const mongoDb: UserDatabase = {
	async findUserById(userId: string) {
		const db = mongo.db(process.env.MONGODB_DATABASE);

		const user = await db
			.collection('users')
			.findOne(
				{ _id: new ObjectId(userId) },
				{ projection: { _id: 1, customer_id: 1 } }
			);

		return user
			? {
					id: user._id.toString(),
					customer_id: user.customer_id || undefined,
			  }
			: null;
	},
};

// For Supabase:
import { createClient } from '@/lib/supabase/client';
const supabaseDb: UserDatabase = {
	async findUserById(userId: string) {
		const supabase = createClient();

		// Try to find existing profile
		const { data: profile } = await supabase
			.from('profiles')
			.select('id, customer_id')
			.eq('id', userId)
			.single();

		// If no profile exists, create one
		if (!profile) {
			// Get user email from auth session for profile creation
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const { data: newProfile, error } = await supabase
				.from('profiles')
				.insert([
					{
						id: userId,
						email: user?.email,
					},
				])
				.select('id, customer_id')
				.single();

			if (error) {
				console.error('Failed to create user profile:', error);
				throw new Error('Failed to create user profile');
			}

			return newProfile;
		}

		return profile;
	},
};

// Automatically choose database implementation based on config
const getDatabaseImplementation = (): UserDatabase => {
	const { provider } = getDatabaseConfig();

	switch (provider) {
		case 'prisma':
			return prismaDb;
		case 'mongodb':
			return mongoDb;
		case 'supabase':
			return supabaseDb;
		default:
			throw new Error(`Database provider ${provider} not implemented`);
	}
};

const db: UserDatabase = getDatabaseImplementation();

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
			return NextResponse.json(
				{ error: 'Price ID must be provided' },
				{ status: 400 }
			);
		}
		if (!successUrl || !cancelUrl) {
			return NextResponse.json(
				{ error: 'Both success and cancel URLs are required' },
				{ status: 400 }
			);
		}
		if (!mode) {
			return NextResponse.json(
				{
					error:
						"Checkout mode is required ('payment' for one-time or 'subscription' for recurring)",
				},
				{ status: 400 }
			);
		}

		const dbUser = await db.findUserById(userSession.user.id);

		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User record not found' },
				{ status: 404 }
			);
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
		return NextResponse.json(
			{ error: (error as Error)?.message },
			{ status: 500 }
		);
	}
}
