import config from '@/config';
import type {
	DatabaseProvider,
	AuthProvider,
	PaymentProvider,
	EmailProvider,
} from '@/types/config';

/**
 * Get the current database configuration (MongoDB only)
 */
export function getDatabaseConfig() {
	const provider: DatabaseProvider = 'mongodb';
	const dbConfig = config.database.mongodb;

	if (!dbConfig) {
		throw new Error(`Database configuration for ${provider} not found`);
	}

	return { provider, config: dbConfig };
}

/**
 * Get the current auth configuration (Better Auth only)
 */
export function getAuthConfig() {
	const provider: AuthProvider = 'better-auth';
	const authConfig = config.auth.betterAuth;

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
 * Check if a feature is enabled
 */
export function isFeatureEnabled(
	feature: keyof typeof config.features
): boolean {
	return config.features[feature];
}

/**
 * Get service provider
 */
export function getServiceProvider(service: keyof typeof config.services) {
	return config.services[service];
}

/**
 * Get app metadata
 */
export function getAppMetadata() {
	return {
		name: config.appName,
		description: config.appDescription,
		domain: config.domainName,
		style: config.style,
		seo: config.seo,
	};
}
