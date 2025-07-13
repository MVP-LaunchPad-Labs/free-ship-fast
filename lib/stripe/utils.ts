import Stripe from 'stripe';

type CheckoutMode = 'payment' | 'subscription';

interface CheckoutSessionConfig {
	priceId: string;
	mode: CheckoutMode;
	successUrl: string;
	cancelUrl: string;
	couponId?: string | null;
	clientReferenceId?: string;
	customer?: {
		id?: string;
		email?: string;
	};
}

interface CustomerPortalConfig {
	customerId: string;
	returnUrl: string;
}

// Initialize Stripe client with environment validation
const getStripeInstance = () => {
	const apiKey = process.env.STRIPE_SECRET_KEY;
	if (!apiKey) {
		throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
	}
	
	return new Stripe(apiKey, {
		apiVersion: '2025-06-30.basil',
		typescript: true,
	});
};

export const createCheckoutSession = async ({
	customer,
	mode,
	clientReferenceId,
	successUrl,
	cancelUrl,
	priceId,
	couponId,
}: CheckoutSessionConfig): Promise<string | null> => {
	try {
		const stripe = getStripeInstance();

		// Configure session parameters based on customer status
		const sessionConfig: {
			customer?: string;
			customer_creation?: 'always';
			customer_email?: string;
			invoice_creation?: { enabled: boolean };
			payment_intent_data?: { setup_future_usage: 'on_session' };
			tax_id_collection?: { enabled: boolean };
		} = {};

		if (customer?.id) {
			sessionConfig.customer = customer.id;
		} else {
			if (mode === 'payment') {
				sessionConfig.customer_creation = 'always';
				sessionConfig.invoice_creation = { enabled: true };
				sessionConfig.payment_intent_data = { setup_future_usage: 'on_session' };
			}
			if (customer?.email) {
				sessionConfig.customer_email = customer.email;
			}
			sessionConfig.tax_id_collection = { enabled: true };
		}

		const checkoutSession = await stripe.checkout.sessions.create({
			mode,
			allow_promotion_codes: true,
			client_reference_id: clientReferenceId,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			discounts: couponId ? [{ coupon: couponId }] : [],
			success_url: successUrl,
			cancel_url: cancelUrl,
			locale: 'pt-BR',
			...sessionConfig,
		});

		return checkoutSession.url || null;
	} catch (error) {
		console.error('Failed to create checkout session:', error);
		return null;
	}
};

export const retrieveCheckoutSession = async (sessionId: string): Promise<Stripe.Checkout.Session | null> => {
	try {
		const stripe = getStripeInstance();

		const sessionData = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items'],
		});

		return sessionData;
	} catch (error) {
		console.error('Failed to retrieve checkout session:', error);
		return null;
	}
};
