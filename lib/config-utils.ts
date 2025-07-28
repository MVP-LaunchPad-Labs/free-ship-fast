import config from '@/config';

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig() {
	return config.supabase;
}

/**
 * Get auth configuration
 */
export function getAuthConfig() {
	return config.auth;
}

/**
 * Get the current payment configuration based on which payment provider is configured
 */
export function getPaymentConfig() {
	if (config.payment.stripe?.publishableKey) {
		return { provider: 'stripe' as const, config: config.payment.stripe };
	}

	if (config.payment.lemonsqueezy?.apiKey) {
		return {
			provider: 'lemonsqueezy' as const,
			config: config.payment.lemonsqueezy,
		};
	}

	throw new Error('No payment provider configured');
}

/**
 * Get email configuration
 */
export function getEmailConfig() {
	if (!config.email.resend) {
		throw new Error('Email configuration for resend not found');
	}

	return { provider: 'resend' as const, config: config.email.resend };
}
