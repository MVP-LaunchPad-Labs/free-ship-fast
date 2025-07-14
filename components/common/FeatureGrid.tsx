'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
	Check,
	Mail,
	CreditCard,
	Shield,
	Database,
	Palette,
	Zap,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Feature list with updated SaaS-focused content
 * Removed fitness-specific references and added generic development features
 */
const features: {
	name: string;
	description: React.ReactNode;
	icon: React.ReactNode;
}[] = [
	{
		name: 'Email System',
		description: (
			<ul className='space-y-2'>
				{[
					'Send transactional emails',
					'DNS setup to avoid spam folder (DKIM, DMARC, SPF)',
					'Webhook integration for email handling',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 8 hours</span>
				</li>
			</ul>
		),
		icon: <Mail className='size-8 text-primary' />,
	},
	{
		name: 'Payment Processing',
		description: (
			<ul className='space-y-2'>
				{[
					'Create checkout sessions',
					'Handle webhooks to update user accounts',
					'Tips to setup your account & reduce chargebacks',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 12 hours</span>
				</li>
			</ul>
		),
		icon: <CreditCard className='size-8 text-primary' />,
	},
	{
		name: 'Authentication',
		description: (
			<ul className='space-y-2'>
				{[
					'Magic links setup',
					'OAuth login with Google',
					'Save user data in database',
					'Private/protected pages & API calls',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 15 hours</span>
				</li>
			</ul>
		),
		icon: <Shield className='size-8 text-primary' />,
	},
	{
		name: 'Database & ORM',
		description: (
			<ul className='space-y-2'>
				{[
					'Prisma schema setup',
					'Database migrations',
					'Type-safe database queries',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 6 hours</span>
				</li>
			</ul>
		),
		icon: <Database className='size-8 text-primary' />,
	},
	{
		name: 'UI Components',
		description: (
			<ul className='space-y-2'>
				{[
					'shadcn/ui component library',
					'Responsive design system',
					'Dark/light mode support',
					'Custom animations & transitions',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 20 hours</span>
				</li>
			</ul>
		),
		icon: <Palette className='size-8 text-primary' />,
	},
	{
		name: 'Performance & SEO',
		description: (
			<ul className='space-y-2'>
				{[
					'Next.js optimization',
					'SEO meta tags & sitemap',
					'Image optimization',
					'Bundle size optimization',
				].map((item) => (
					<li
						key={item}
						className='flex items-start gap-3'
					>
						<Check className='size-4 shrink-0 text-chart-4 mt-0.5' />
						<span className='text-sm text-card-foreground'>{item}</span>
					</li>
				))}
				<li className='flex items-start gap-3 text-primary font-medium pt-2'>
					<Check className='size-4 shrink-0 mt-0.5' />
					<span className='text-sm'>Time saved: 10 hours</span>
				</li>
			</ul>
		),
		icon: <Zap className='size-8 text-primary' />,
	},
];

/**
 * Features list item component with hover animations
 */
const FeatureItem = ({
	index,
	feature,
	isVisible,
}: {
	index: number;
	feature: (typeof features)[0];
	isVisible: boolean;
}) => {
	return (
		<Card
			className={`relative h-full transition-all duration-500 hover:shadow-lg hover:scale-105 bg-card/50 border-border backdrop-blur-sm ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
			}`}
			style={{ transitionDelay: `${index * 100}ms` }}
			data-slot='feature-card'
		>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-4'>
					<div className='p-3 bg-primary/10 rounded-lg'>{feature.icon}</div>
					<div>
						<CardTitle className='text-xl font-bold text-card-foreground'>
							{feature.name}
						</CardTitle>
						<Badge
							variant='secondary'
							className='mt-1 text-xs'
						>
							Essential Feature
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>{feature.description}</CardContent>
		</Card>
	);
};

/**
 * Feature grid component with shadcn/ui styling
 *
 * Features:
 * - Grid layout showcasing 6 key SaaS features
 * - Smooth scroll-triggered animations
 * - Hover effects and transitions
 * - Time-saved indicators for each feature
 * - Responsive design with proper spacing
 * - shadcn/ui Cards with consistent styling
 * - Tailwind variable colors throughout
 */
const FeatureGrid = () => {
	const [visibleItems, setVisibleItems] = useState<boolean[]>(
		new Array(features.length).fill(false)
	);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observers = itemRefs.current.map((ref, index) => {
			if (!ref) return null;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setVisibleItems((prev) => {
							const newState = [...prev];
							newState[index] = true;
							return newState;
						});
					}
				},
				{ threshold: 0.1, rootMargin: '50px' }
			);

			observer.observe(ref);
			return observer;
		});

		return () => {
			observers.forEach((observer) => observer?.disconnect());
		};
	}, []);

	return (
		<section
			className='py-24 md:py-32 bg-muted/30'
			id='features-list'
			aria-labelledby='features-list-heading'
			data-slot='features-listicle-section'
		>
			<div className='px-8 max-w-7xl mx-auto'>
				<div className='text-center mb-16 md:mb-24'>
					<Badge
						variant='secondary'
						className='mb-4'
					>
						Complete Feature Set
					</Badge>
					<h2
						id='features-list-heading'
						className='font-extrabold text-4xl lg:text-6xl tracking-tight mb-6 text-foreground'
					>
						Everything you need to{' '}
						<span className='bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent'>
							ship fast
						</span>
					</h2>
					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						Save weeks of development time with our comprehensive boilerplate
						featuring all essential SaaS components
					</p>
				</div>

				<div
					className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12'
					role='list'
					aria-label='Feature list'
				>
					{features.map((feature, index) => (
						<div
							key={feature.name}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							role='listitem'
						>
							<FeatureItem
								index={index}
								feature={feature}
								isVisible={visibleItems[index]}
							/>
						</div>
					))}
				</div>

				<div className='text-center mt-16'>
					<Card className='inline-block bg-primary/5 border-primary/20'>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4'>
								<div className='p-3 bg-primary/10 rounded-full'>
									<Zap className='size-6 text-primary' />
								</div>
								<div className='text-left'>
									<p className='font-semibold text-foreground'>
										Total Time Saved: 70+ hours
									</p>
									<p className='text-sm text-muted-foreground'>
										Focus on your unique features, not boilerplate code
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default FeatureGrid;
