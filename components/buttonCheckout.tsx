'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import apiClient from '@/lib/api';
import logo from '@/app/icon.png';
import config from '@/config';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface ButtonCheckoutProps {
	priceId: string;
	mode?: 'payment' | 'subscription';
}

const ButtonCheckout = ({ priceId, mode = 'payment' }: ButtonCheckoutProps) => {
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

	const isDisabled = IS_PRODUCTION || isLoading;

	return (
		<button
			className='btn btn-primary btn-block group'
			onClick={handlePayment}
			disabled={isDisabled}
		>
			{isLoading ? (
				<span className='loading loading-spinner loading-xs' />
			) : (
				<Image
					src={logo}
					alt={`${config.appName} logo`}
					priority
					className='w-6 h-6'
					width={24}
					height={24}
				/>
			)}
			{IS_PRODUCTION ? 'WIP 🚧' : `Get ${config.appName}`}
		</button>
	);
};

export default ButtonCheckout;
