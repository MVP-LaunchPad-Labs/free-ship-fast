export interface ConfigProps {
	appName: string;
	appDescription: string;
	domainName: string;

	// Supabase configuration
	supabase: {
		url: string;
		anonKey: string;
		serviceRoleKey: string;
	};

	// Auth configuration
	auth: {
		loginUrl: string;
		callbackUrl: string;
		redirectTo: string;
		providers: ('google' | 'github' | 'discord')[];
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

	// Email configuration
	email: {
		resend?: {
			apiKey: string;
			fromNoReply: string;
			fromAdmin: string;
			supportEmail?: string;
			forwardRepliesTo?: string;
		};
	};
}
