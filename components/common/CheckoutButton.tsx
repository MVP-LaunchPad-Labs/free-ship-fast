'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import logo from '@/app/icon.svg';
import config from '@/config';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface CheckoutButtonProps {
	priceId: string;
	mode?: 'payment' | 'subscription';
	className?: string;
	children?: React.ReactNode;
}

/**
 * Checkout button component with Stripe integration
 *
 * Features:
 * - Stripe checkout session creation
 * - Loading states and error handling
 * - Support for payment and subscription modes
 * - shadcn/ui Button component
 * - Toast notifications for feedback
 */
const CheckoutButton = ({
	priceId,
	mode = 'payment',
	className,
	children,
}: CheckoutButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handlePayment = async () => {
		if (isLoading) return;

		setIsLoading(true);

		try {
			const { url }: { url: string } = await apiClient.post(
				'/stripe/create-checkout',
				{
					priceId,
					successUrl: window.location.href,
					cancelUrl: window.location.href,
					mode,
				}
			);

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
