import {
	NewCheckout,
	createCheckout,
	getCustomer,
	lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Create a LemonSqueezy checkout session
 * Used by the CheckoutButton component
 */
export const createCheckoutSession = async ({
	variantId,
	successUrl,
	cancelUrl,
	userId,
	email,
	discountCode,
}: {
	variantId: string;
	successUrl: string;
	cancelUrl?: string;
	userId?: string;
	email?: string;
	discountCode?: string;
}): Promise<string | null> => {
	try {
		// Setup LemonSqueezy
		lemonSqueezySetup({
			apiKey: process.env.LEMONSQUEEZY_API_KEY!,
		});

		const checkoutConfig: NewCheckout = {
			productOptions: {
				redirectUrl: successUrl,
			},
			checkoutData: {
				email,
				discountCode,
				custom: userId ? { user_id: userId } : undefined,
			},
		};

		const { data, error } = await createCheckout(
			process.env.LEMONSQUEEZY_STORE_ID!,
			variantId,
			checkoutConfig
		);

		if (error) {
			console.error('LemonSqueezy checkout failed:', error);
			return null;
		}

		return data?.data?.attributes?.url || null;
	} catch (error) {
		console.error('LemonSqueezy error:', error);
		return null;
	}
};

/**
 * Create customer portal for subscription management
 * Users can update payment methods, cancel subscriptions, etc.
 */
export const createCustomerPortalSession = async (
	customerId: string
): Promise<string | null> => {
	try {
		lemonSqueezySetup({
			apiKey: process.env.LEMONSQUEEZY_API_KEY!,
		}); 

		const { data, error } = await getCustomer(customerId);

		if (error) {
			console.error('Customer portal failed:', error);
			return null;
		}

		return data?.data?.attributes?.urls?.customer_portal || null;
	} catch (error) {
		console.error('Customer portal error:', error);
		return null;
	}
};

/**
 * Validate LemonSqueezy webhook signature
 *
 * @param rawPayload - Raw webhook payload
 * @param webhookSignature - Webhook signature from headers
 * @returns boolean - Whether signature is valid
 */
export const verifyWebhookSignature = (
	rawPayload: string,
	webhookSignature: string
): boolean => {
	const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

	if (!webhookSecret) {
		console.error(
			'LEMONSQUEEZY_WEBHOOK_SECRET environment variable is required'
		);
		return false;
	}

	// LemonSqueezy uses HMAC-SHA256 for webhook signatures
	const crypto = require('crypto');
	const computedSignature = crypto
		.createHmac('sha256', webhookSecret)
		.update(rawPayload)
		.digest('hex');

	return crypto.timingSafeEqual(
		Buffer.from(webhookSignature),
		Buffer.from(computedSignature)
	);
};

/**
 * Helper function to get LemonSqueezy instance configuration
 * Useful for debugging and testing
 */
export const getEnvironmentStatus = () => {
	return {
		hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
		hasStoreId: !!process.env.LEMONSQUEEZY_STORE_ID,
		hasWebhookSecret: !!process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
	};
};
