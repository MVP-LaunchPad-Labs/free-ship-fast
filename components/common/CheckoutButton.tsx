'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import { getPaymentConfig } from '@/lib/config-utils';
import config from '@/config';

interface CheckoutButtonProps {
	planId: string; // priceId for Stripe, variantId for LemonSqueezy
	mode?: 'payment' | 'subscription';
	className?: string;
	children?: React.ReactNode;
}

/**
 * Checkout button component with multi-provider payment support
 *
 * Features:
 * - Stripe and LemonSqueezy checkout session creation
 * - Automatic provider detection from config
 * - Loading states and error handling
 * - Support for payment and subscription modes
 * - shadcn/ui Button component
 * - Toast notifications for feedback
 */
const CheckoutButton = ({
	planId,
	mode = 'payment',
	className,
	children,
}: CheckoutButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const { provider } = getPaymentConfig();

	const handlePayment = async () => {
		if (isLoading) return;

		setIsLoading(true);

		try {
			let url: string;

			if (provider === 'stripe') {
				const response: { url: string } = await apiClient.post(
					'/stripe/create-checkout',
					{
						priceId: planId,
						successUrl: window.location.href,
						cancelUrl: window.location.href,
						mode,
					}
				);
				url = response.url;
			} else if (provider === 'lemonsqueezy') {
				const response: { url: string } = await apiClient.post(
					'/lemonsqueezy/create-checkout',
					{
						variantId: planId,
						successUrl: window.location.href,
						cancelUrl: window.location.href,
					}
				);
				url = response.url;
			} else {
				throw new Error(`Payment provider ${provider} not supported`);
			}

			window.location.href = url;
		} catch (error) {
			console.error('Payment error:', error);
			toast.error('Payment failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handlePayment}
			disabled={isLoading}
			size='lg'
			className={`w-full mt-8 gap-2 ${className || ''}`}
			data-slot='checkout-button'
		>
			{isLoading ? (
				<>
					<Loader2 className='size-4 animate-spin' />
					Processing...
				</>
			) : (
				<>
					{children || (
						<>
							<CreditCard className='size-4' />
							Get {config.appName}
						</>
					)}
				</>
			)}
		</Button>
	);
};

export default CheckoutButton;
