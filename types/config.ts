export type DatabaseProvider = 'prisma';
export type AuthProvider = 'better-auth';
export type PaymentProvider = 'stripe' | 'lemonsqueezy';
export type EmailProvider = 'resend' | 'nodemailer' | 'sendgrid';

export interface ConfigProps {
	appName: string;
	appDescription: string;
	domainName: string;

	// Service provider selections
	services: {
		database: DatabaseProvider;
		auth: AuthProvider;
		payment: PaymentProvider;
		email: EmailProvider;
	};

	// Database configurations
	database: {
		prisma: {
			databaseUrl: string;
		};
	};

	// Auth configurations
	auth: {
		loginUrl: string;
		callbackUrl: string;
		betterAuth: {
			secret: string;
			baseUrl: string;
			providers: ('google' | 'github' | 'discord')[];
		};
	};

	// Payment configurations
	payment: {
		stripe?: {
			publishableKey: string;
			secretKey: string;
			webhookSecret: string;
			plans: {
				isFeatured?: boolean;
				priceId: string;
				name: string;
				description?: string;
				price: number;
				priceAnchor?: number;
				features: {
					name: string;
				}[];
			}[];
		};
		lemonsqueezy?: {
			apiKey: string;
			storeId: string;
			webhookSecret: string;
			plans: {
				isFeatured?: boolean;
				variantId: string;
				name: string;
				description?: string;
				price: number;
				priceAnchor?: number;
				features: {
					name: string;
				}[];
			}[];
		};
	};

	// Email configurations
	email: {
		resend?: {
			apiKey: string;
			fromEmail: string;
		};
		nodemailer?: {
			host: string;
			port: number;
			secure: boolean;
			auth: {
				user: string;
				pass: string;
			};
		};
		sendgrid?: {
			apiKey: string;
			fromEmail: string;
		};
	};

	// Analytics configurations (optional)
	analytics?: {
		umami?: {
			websiteId: string;
			url: string;
		};
		posthog?: {
			key: string;
			host: string;
		};
	};
}
