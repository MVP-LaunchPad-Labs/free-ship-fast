import * as React from 'react';
import { Check } from 'lucide-react';

import config from '@/config';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import CheckoutButton from './CheckoutButton';

/**
 * Pricing section component with shadcn/ui styling
 *
 * Features:
 * - Dynamic plan rendering from config
 * - Featured plan highlighting with badge
 * - Responsive card layout with proper spacing
 * - Check icons for feature lists
 * - Tailwind variable colors throughout
 */
const Pricing = () => {
	return (
		<section
			className='bg-muted/30 overflow-hidden'
			id='pricing'
			aria-labelledby='pricing-heading'
			data-slot='pricing-section'
		>
			<div className='py-24 px-8 max-w-5xl mx-auto'>
				<div className='flex flex-col text-center w-full mb-20'>
					<h2
						id='pricing-heading'
						className='font-bold text-3xl lg:text-5xl tracking-tight text-foreground'
					>
						Choose the perfect plan and supercharge your app with our platform
					</h2>
				</div>

				<div
					className='relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8'
					role='list'
					aria-label='Pricing plans'
				>
					{config.stripe.plans.map((plan) => (
						<div
							key={plan.priceId}
							className='relative w-full max-w-lg'
							role='listitem'
						>
							{plan.isFeatured && (
								<div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'>
									<Badge
										variant='default'
										className='bg-primary text-primary-foreground border-0 text-xs font-semibold px-3 py-1'
									>
										POPULAR
									</Badge>
								</div>
							)}

							{plan.isFeatured && (
								<div className='absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/20 to-primary z-10' />
							)}

							<Card className='relative flex flex-col h-full z-10 bg-card border-border shadow-sm hover:shadow-md transition-shadow'>
								<CardHeader className='pb-4'>
									<div className='flex justify-between items-center gap-4'>
										<div>
											<h3 className='text-lg lg:text-xl font-bold text-card-foreground'>
												{plan.name}
											</h3>
											{plan.description && (
												<p className='text-muted-foreground mt-2'>
													{plan.description}
												</p>
											)}
										</div>
									</div>
								</CardHeader>

								<CardContent className='flex-1 space-y-6'>
									{/* Price section */}
									<div className='flex gap-2 items-end'>
										{plan.priceAnchor && (
											<div className='flex flex-col justify-end mb-[4px] text-lg'>
												<p className='relative'>
													<span className='absolute bg-muted-foreground h-[1.5px] inset-x-0 top-[53%]' />
													<span className='text-muted-foreground'>
														${plan.priceAnchor}
													</span>
												</p>
											</div>
										)}
										<p className='text-5xl tracking-tight font-extrabold text-foreground'>
											${plan.price.toFixed(2)}
										</p>
									</div>

									{/* Features list */}
									{plan.features && (
										<ul className='space-y-2.5 leading-relaxed text-base'>
											{plan.features.map((feature, i) => (
												<li
													key={i}
													className='flex items-center gap-2'
												>
													<Check className='size-[18px] text-primary shrink-0' />
													<span className='text-card-foreground'>
														{feature.name}
													</span>
												</li>
											))}
										</ul>
									)}
								</CardContent>

								<CardFooter className='pt-4'>
									<CheckoutButton
										priceId={plan.priceId}
										mode='subscription'
									/>
								</CardFooter>
							</Card>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Pricing;
