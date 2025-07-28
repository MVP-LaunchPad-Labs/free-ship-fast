export type DatabaseProvider = 'mongodb';
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
		mongodb: {
			connectionString: string;
			databaseName: string;
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
			plans: Array<{
				priceId: string;
				name: string;
				description?: string;
				price: number;
				currency: string;
				interval?: 'month' | 'year';
			}>;
		};
		lemonsqueezy?: {
			apiKey: string;
			storeId: string;
			webhookSecret: string;
			plans: Array<{
				variantId: string;
				name: string;
				description?: string;
				price: number;
				currency: string;
			}>;
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
			fromEmail: string;
		};
		sendgrid?: {
			apiKey: string;
			fromEmail: string;
		};
	};

	// Style configurations
	style: {
		theme: 'light' | 'dark' | 'system';
		accentColor: string;
		font: string;
	};

	// SEO configurations
	seo: {
		keywords: string[];
		twitterHandle?: string;
		ogImage?: string;
	};

	// Features
	features: {
		analytics: boolean;
		blog: boolean;
		testimonials: boolean;
		newsletter: boolean;
		waitlist: boolean;
	};
}
