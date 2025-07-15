export type DatabaseProvider = 'prisma' | 'mongodb' | 'supabase';
export type AuthProvider = 'better-auth' | 'supabase' | 'next-auth';
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
		prisma?: {
			databaseUrl: string;
		};
		mongodb?: {
			connectionString: string;
			databaseName: string;
		};
		supabase?: {
			url: string;
			anonKey: string;
			serviceRoleKey: string;
		};
	};

	// Auth configurations
	auth: {
		loginUrl: string;
		callbackUrl: string;
		betterAuth?: {
			secret: string;
			baseUrl: string;
			providers: ('google' | 'github' | 'discord')[];
		};
		supabase?: {
			redirectTo: string;
			providers: ('google' | 'github' | 'discord')[];
		};
		nextAuth?: {
			secret: string;
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
			fromNoReply: string;
			fromAdmin: string;
			supportEmail?: string;
			forwardRepliesTo?: string;
		};
		nodemailer?: {
			host: string;
			port: number;
			secure: boolean;
			auth: {
				user: string;
				pass: string;
			};
			fromNoReply: string;
			fromAdmin: string;
		};
		sendgrid?: {
			apiKey: string;
			fromNoReply: string;
			fromAdmin: string;
		};
	};
}
