import config from '@/config';

/**
 * Get the current database configuration (Prisma only)
 */
export function getDatabaseConfig() {
	return {
		provider: 'prisma' as const,
		config: config.database.prisma,
	};
}

/**
 * Get the current auth configuration (Better Auth only)
 */
export function getAuthConfig() {
	return {
		provider: 'better-auth' as const,
		config: config.auth.betterAuth,
		loginUrl: config.auth.loginUrl,
		callbackUrl: config.auth.callbackUrl,
	};
}

/**
 * Get the current payment configuration
 */
export function getPaymentConfig() {
	const provider = config.services.payment;
	const paymentConfig = config.payment[provider];

	if (!paymentConfig) {
		throw new Error(`Payment configuration for ${provider} not found`);
	}

	return { provider, config: paymentConfig };
}

/**
 * Get the current email configuration
 */
export function getEmailConfig() {
	const provider = config.services.email;
	const emailConfig = config.email[provider];

	if (!emailConfig) {
		throw new Error(`Email configuration for ${provider} not found`);
	}

	return { provider, config: emailConfig };
}

/**
 * Get all active service providers
 */
export function getActiveServices() {
	return {
		database: config.services.database,
		auth: config.services.auth,
		payment: config.services.payment,
		email: config.services.email,
	};
}
