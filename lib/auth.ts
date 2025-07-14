import { PrismaClient } from '@/prisma/generated/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { sendMagicLinkEmail } from './email/sendEmail';

/*
 * MongoDB imports (uncomment if using MongoDB)
 * import { mongodbAdapter } from 'better-auth/adapters/mongodb';
 * import { mongo } from './db/mongodb/client';
 */

/**
 * Database client initialization
 * PostgreSQL/MySQL/SQLite: Uses Prisma ORM for type safety and migrations
 */
const prisma = new PrismaClient();

/*
 * MongoDB alternative: Direct MongoDB connection
 * const mongo = mongo; // Import from your MongoDB client
 */

export const auth = betterAuth({
	/**
	 * DATABASE ADAPTER CONFIGURATION
	 * Choose based on your database preference:
	 */
	
	/**
	 * Option 1: Prisma adapter (PostgreSQL/MySQL/SQLite)
	 * ✅ Pros: Type safety, migrations, excellent DX
	 * ❌ Cons: Additional abstraction layer
	 */
	database: prismaAdapter(prisma, {
		provider: 'postgresql', // Change to: 'mysql', 'sqlite', etc.
	}),

	/**
	 * Option 2: MongoDB adapter (uncomment to use)
	 * ✅ Pros: Schema flexibility, horizontal scaling
	 * ❌ Cons: No built-in relations, less type safety
	 */
	/*
	database: mongodbAdapter(mongo, {
		database: process.env.MONGODB_DATABASE || 'your-database-name',
	}),
	*/

	/**
	 * SOCIAL AUTHENTICATION PROVIDERS
	 * Add more providers as needed (GitHub, Discord, etc.)
	 */
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},

	/** AUTHENTICATION PLUGINS */
	plugins: [
		/** Next.js cookie handling */
		nextCookies(),
		
		/** Magic link authentication (passwordless) */
		magicLink({
			sendMagicLink: async ({ email, token, url }, request) => {
				/* Custom email sending logic */
				await sendMagicLinkEmail(email, url, { email });
			},
		}),
	],
});
