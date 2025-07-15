import type { ConfigProps } from '@/types/config';

const config: ConfigProps = {
	appName: 'YourAppName',
	appDescription:
		'A brief description of what your app does and its main value proposition.',
	domainName: 'yourdomain.com',

	// Service provider selections - change these to switch providers
	services: {
		database: 'prisma', // 'prisma' | 'mongodb' | 'supabase'
		auth: 'better-auth', // 'better-auth' | 'supabase' | 'next-auth'
		payment: 'lemonsqueezy', // 'stripe' | 'lemonsqueezy'
		email: 'resend', // 'resend' | 'nodemailer' | 'sendgrid'
	},

	// Database configurations
	database: {
		prisma: {
			databaseUrl: process.env.DATABASE_URL || '',
		},
		mongodb: {
			connectionString: process.env.MONGODB_URI || '',
			databaseName: process.env.MONGODB_DATABASE || 'your-app',
		},
		supabase: {
			url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
			anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
			serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
		},
	},

	// Auth configurations
	auth: {
		loginUrl: '/sign-in',
		callbackUrl: '/dashboard',
		betterAuth: {
			secret: process.env.BETTER_AUTH_SECRET || '',
			baseUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
			providers: ['google', 'github'],
		},
		supabase: {
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?redirect=/dashboard`,
			providers: ['google', 'github'],
		},
		nextAuth: {
			secret: process.env.NEXTAUTH_SECRET || '',
			providers: ['google', 'github'],
		},
	},

	// Payment configurations
	payment: {
		// Only configure the payment provider you're using
		// Stripe configuration (uncomment if using Stripe)
		// stripe: {
		// 	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
		// 	secretKey: process.env.STRIPE_SECRET_KEY || '',
		// 	webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
		// 	plans: [
		// 		{
		// 			priceId: 'price_1234567890',
		// 			name: 'Basic Plan',
		// 			description: 'Perfect for getting started',
		// 			price: 9.99,
		// 			isFeatured: true,
		// 			features: [
		// 				{ name: 'Feature 1' },
		// 				{ name: 'Feature 2' },
		// 				{ name: 'Feature 3' },
		// 			],
		// 		},
		// 		{
		// 			priceId: 'price_0987654321',
		// 			name: 'Pro Plan',
		// 			description: 'For growing businesses',
		// 			price: 19.99,
		// 			priceAnchor: 29.99,
		// 			features: [
		// 				{ name: 'All Basic features' },
		// 				{ name: 'Advanced Feature 1' },
		// 				{ name: 'Advanced Feature 2' },
		// 				{ name: 'Priority Support' },
		// 			],
		// 		},
		// 	],
		// },

		// LemonSqueezy configuration (currently active)
		lemonsqueezy: {
			apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
			storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
			webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
			plans: [
				{
					variantId: '123456',
					name: 'Basic Plan',
					description: 'Perfect for getting started',
					price: 9.99,
					isFeatured: true,
					features: [
						{ name: 'Feature 1' },
						{ name: 'Feature 2' },
						{ name: 'Feature 3' },
					],
				},
				{
					variantId: '789012',
					name: 'Pro Plan',
					description: 'For growing businesses',
					price: 19.99,
					priceAnchor: 29.99,
					features: [
						{ name: 'All Basic features' },
						{ name: 'Advanced Feature 1' },
						{ name: 'Advanced Feature 2' },
						{ name: 'Priority Support' },
					],
				},
			],
		},
	},

	// Email configurations
	email: {
		resend: {
			apiKey: process.env.RESEND_API_KEY || '',
			fromNoReply:
				process.env.RESEND_FROM_EMAIL || 'YourAppName <noreply@yourdomain.com>',
			fromAdmin: 'Your Name at YourAppName <yourname@yourdomain.com>',
			supportEmail: 'support@yourdomain.com',
			forwardRepliesTo: 'your.email@gmail.com',
		},
		nodemailer: {
			host: process.env.SMTP_HOST || 'smtp.gmail.com',
			port: parseInt(process.env.SMTP_PORT || '587'),
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER || '',
				pass: process.env.SMTP_PASS || '',
			},
			fromNoReply: 'YourAppName <noreply@yourdomain.com>',
			fromAdmin: 'Your Name at YourAppName <yourname@yourdomain.com>',
		},
		sendgrid: {
			apiKey: process.env.SENDGRID_API_KEY || '',
			fromNoReply: 'YourAppName <noreply@yourdomain.com>',
			fromAdmin: 'Your Name at YourAppName <yourname@yourdomain.com>',
		},
	},
};

export default config;
