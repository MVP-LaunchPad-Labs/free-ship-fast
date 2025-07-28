import type { ConfigProps } from '@/types/config';

const config: ConfigProps = {
	appName: 'YourAppName',
	appDescription:
		'A brief description of what your app does and its main value proposition.',
	domainName: 'yourdomain.com',

	// Service provider selections
	services: {
		database: 'mongodb',
		auth: 'better-auth',
		payment: 'lemonsqueezy', // 'stripe' | 'lemonsqueezy'
		email: 'resend', // 'resend' | 'nodemailer' | 'sendgrid'
	},

	// Database configurations
	database: {
		mongodb: {
			connectionString: process.env.MONGODB_URI || '',
			databaseName: process.env.MONGODB_DATABASE || 'your-app',
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
	},

	// Payment configurations
	payment: {
		stripe: {
			publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
			secretKey: process.env.STRIPE_SECRET_KEY || '',
			webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
			plans: [
				{
					priceId: process.env.STRIPE_PRICE_ID_STARTER || '',
					name: 'Starter',
					description: 'Perfect for getting started',
					price: 9,
					currency: 'USD',
					interval: 'month',
				},
			],
		},
		lemonsqueezy: {
			apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
			storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
			webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
			plans: [
				{
					variantId: process.env.LEMONSQUEEZY_VARIANT_ID_STARTER || '',
					name: 'Starter',
					description: 'Perfect for getting started',
					price: 9,
					currency: 'USD',
				},
			],
		},
	},

	// Email configurations
	email: {
		resend: {
			apiKey: process.env.RESEND_API_KEY || '',
			fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@yourdomain.com',
		},
		nodemailer: {
			host: process.env.NODEMAILER_HOST || '',
			port: parseInt(process.env.NODEMAILER_PORT || '587'),
			secure: process.env.NODEMAILER_SECURE === 'true',
			auth: {
				user: process.env.NODEMAILER_USER || '',
				pass: process.env.NODEMAILER_PASS || '',
			},
			fromEmail: process.env.NODEMAILER_FROM_EMAIL || 'noreply@yourdomain.com',
		},
		sendgrid: {
			apiKey: process.env.SENDGRID_API_KEY || '',
			fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
		},
	},

	// Style configurations
	style: {
		theme: 'system',
		accentColor: '#3b82f6',
		font: 'Inter',
	},

	// SEO configurations
	seo: {
		keywords: ['startup', 'saas', 'boilerplate', 'nextjs'],
		twitterHandle: '@yourdomain',
		ogImage: '/og-image.png',
	},

	// Features
	features: {
		analytics: true,
		blog: true,
		testimonials: true,
		newsletter: true,
		waitlist: true,
	},
};

export default config;
