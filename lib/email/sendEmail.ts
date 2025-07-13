import { MagicLinkLogin } from './templates/MagicLink';

import resend from '.';
import { rateLimit } from '../redis/ratelimit';
export async function sendMagicLinkEmail(
	email: string,
	url: string,
	user: { name?: string; email: string }
) {
	try {
		await rateLimit({ actionType: 'auth', identifier: email });
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [email],
			subject: 'Sign in to your account',
			react: MagicLinkLogin({ url, user }),
		});

		if (error) {
			console.error('Failed to send magic link email:', error);
			throw new Error('Failed to send magic link email');
		}

		return data;
	} catch (error) {
		console.error('Error sending magic link email:', error);
		throw error;
	}
}
