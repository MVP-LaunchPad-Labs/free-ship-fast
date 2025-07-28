import { PrismaClient } from '@/prisma/generated/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { sendMagicLinkEmail } from './email/sendEmail';

/**
 * Database client initialization - PostgreSQL/MySQL/SQLite with Prisma ORM
 */
const prisma = new PrismaClient();

export const auth = betterAuth({
	/**
	 * DATABASE ADAPTER CONFIGURATION
	 * Using Prisma adapter for type safety and migrations
	 */
	database: prismaAdapter(prisma, {
		provider: 'postgresql', // Change to: 'mysql', 'sqlite', etc.
	}),

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
