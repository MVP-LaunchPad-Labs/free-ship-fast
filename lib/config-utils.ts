import config from '@/config';
import type {
	DatabaseProvider,
	AuthProvider,
	PaymentProvider,
	EmailProvider,
} from '@/types/config';

/**
 * Get the current database configuration based on config.services.database
 */
export function getDatabaseConfig() {
	const provider = config.services.database;
	const dbConfig = config.database[provider];

	if (!dbConfig) {
		throw new Error(`Database configuration for ${provider} not found`);
	}

	return { provider, config: dbConfig };
}

/**
 * Get the current auth configuration based on config.services.auth
 */
export function getAuthConfig() {
	const provider = config.services.auth;
	const authConfig = config.auth[provider];

	if (!authConfig) {
		throw new Error(`Auth configuration for ${provider} not found`);
	}

	return {
		provider,
		config: authConfig,
		loginUrl: config.auth.loginUrl,
		callbackUrl: config.auth.callbackUrl,
	};
}

/**
 * Get the current payment configuration based on config.services.payment
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
 * Get the current email configuration based on config.services.email
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
 * Check if a specific service provider is currently active
 */
export function isServiceActive(
	service: keyof typeof config.services,
	provider: string
): boolean {
	return config.services[service] === provider;
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
