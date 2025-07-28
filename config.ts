import type { ConfigProps } from '@/types/config';

const config: ConfigProps = {
	appName: 'YourAppName',
	appDescription:
		'A brief description of what your app does and its main value proposition.',
	domainName: 'yourdomain.com',

	// Supabase configuration
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
	},

	// Auth configuration
	auth: {
		loginUrl: '/sign-in',
		callbackUrl: '/dashboard',
		redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?redirect=/dashboard`,
		providers: ['google', 'github'] as ('google' | 'github' | 'discord')[],
	},

	// Payment configurations
	payment: {
		stripe: {
			publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
			secretKey: process.env.STRIPE_SECRET_KEY || '',
			webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
			plans: [
				{
					isFeatured: false,
					priceId: process.env.STRIPE_PRICE_ID_STARTER || '',
					name: 'Starter',
					description: 'Perfect for getting started',
					price: 9,
					priceAnchor: 19,
					features: [
						{ name: 'Feature 1' },
						{ name: 'Feature 2' },
						{ name: 'Feature 3' },
					],
				},
				{
					isFeatured: true,
					priceId: process.env.STRIPE_PRICE_ID_PRO || '',
					name: 'Pro',
					description: 'Best for professionals',
					price: 29,
					priceAnchor: 59,
					features: [
						{ name: 'All Starter features' },
						{ name: 'Feature 4' },
						{ name: 'Feature 5' },
						{ name: 'Priority support' },
					],
				},
			],
		},
		lemonsqueezy: {
			apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
			storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
			webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
			plans: [
				{
					isFeatured: false,
					variantId: process.env.LEMONSQUEEZY_VARIANT_ID_STARTER || '',
					name: 'Starter',
					description: 'Perfect for getting started',
					price: 9,
					priceAnchor: 19,
					features: [
						{ name: 'Feature 1' },
						{ name: 'Feature 2' },
						{ name: 'Feature 3' },
					],
				},
				{
					isFeatured: true,
					variantId: process.env.LEMONSQUEEZY_VARIANT_ID_PRO || '',
					name: 'Pro',
					description: 'Best for professionals',
					price: 29,
					priceAnchor: 59,
					features: [
						{ name: 'All Starter features' },
						{ name: 'Feature 4' },
						{ name: 'Feature 5' },
						{ name: 'Priority support' },
					],
				},
			],
		},
	},

	// Email configuration
	email: {
		resend: {
			apiKey: process.env.RESEND_API_KEY || '',
			fromNoReply: `noreply@${process.env.DOMAIN_NAME || 'yourdomain.com'}`,
			fromAdmin: `admin@${process.env.DOMAIN_NAME || 'yourdomain.com'}`,
			supportEmail: `support@${process.env.DOMAIN_NAME || 'yourdomain.com'}`,
			forwardRepliesTo: `support@${process.env.DOMAIN_NAME || 'yourdomain.com'}`,
		},
	},
};

export default config;
