import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { sendMagicLinkEmail } from './email/sendEmail';
import { mongo } from './db/mongodb/client';

const db = mongo.db(process.env.MONGODB_DATABASE);

export const auth = betterAuth({
	/**
	 * MongoDB adapter configuration
	 */
	database: mongodbAdapter(db),

	/**
	 * SOCIAL AUTHENTICATION PROVIDERS
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
				await sendMagicLinkEmail(email, url, { email });
			},
		}),
	],
});
