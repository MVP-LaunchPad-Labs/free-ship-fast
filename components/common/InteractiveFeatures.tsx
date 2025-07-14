'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Feature {
	title: string;
	description: string;
	type?: 'video' | 'image';
	path?: string;
	format?: string;
	alt?: string;
}

/**
 * Features configuration for the accordion
 * Updated with different SaaS features for a modern startup toolkit
 */
const features: Feature[] = [
	{
		title: 'Database & Storage',
		description:
			'Pre-configured database schemas, file upload handling with cloud storage, data migrations, backup strategies, and optimized queries for scale',
		type: 'image',
		path: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3542&q=80',
		alt: 'Database dashboard interface',
	},
	{
		title: 'API & Webhooks',
		description:
			'RESTful API endpoints, GraphQL setup, webhook handling, rate limiting, API documentation, versioning, and third-party integrations ready to use',
		type: 'video',
		path: 'https://d3m8mk7e1mf7xn.cloudfront.net/app/api-demo.webm',
		format: 'video/webm',
	},
	{
		title: 'Analytics & Monitoring',
		description:
			'Built-in analytics dashboard, error tracking, performance monitoring, user behavior tracking, A/B testing framework, and custom event logging',
	},
	{
		title: 'Security & Compliance',
		description:
			'GDPR compliance tools, data encryption, security headers, vulnerability scanning, audit logs, 2FA implementation, and privacy policy generators',
		type: 'image',
		path: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
		alt: 'Security dashboard with locks and shields',
	},
	{
		title: 'Advanced Analytics',
		description:
			'Get detailed insights into your business performance with our comprehensive analytics dashboard.',
		type: 'image',
		path: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3542&q=80',
		alt: 'Advanced Analytics dashboard',
	},
	{
		title: 'Team Collaboration',
		description:
			'Work seamlessly with your team using our integrated collaboration tools and real-time features.',
		type: 'image',
		path: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
		alt: 'Team Collaboration dashboard',
	},
];

/**
 * Individual accordion item component
 * Uses shadcn/ui styling and proper accessibility
 */
const AccordionItem = ({
	index,
	feature,
	isOpen,
	setFeatureSelected,
}: {
	index: number;
	feature: Feature;
	isOpen: boolean;
	setFeatureSelected: () => void;
}) => {
	const accordion = useRef<HTMLDivElement>(null);
	const { title, description } = feature;

	return (
		<li>
			<button
				className='relative flex gap-3 items-center w-full py-6 text-base font-medium text-left border-t border-border/20 transition-colors hover:text-primary'
				onClick={(e) => {
					e.preventDefault();
					setFeatureSelected();
				}}
				aria-expanded={isOpen}
				aria-controls={`accordion-content-${index}`}
				id={`accordion-trigger-${index}`}
				data-slot='accordion-trigger'
			>
				<Badge
					variant={isOpen ? 'default' : 'secondary'}
					className='shrink-0 size-8 rounded-full p-0 flex items-center justify-center text-xs font-semibold'
				>
					{index + 1}
				</Badge>

				<span
					className={cn(
						'flex-1 text-left transition-colors',
						isOpen ? 'text-primary' : 'text-foreground'
					)}
				>
					<h3 className='font-semibold text-lg'>{title}</h3>
				</span>

				<ChevronDown
					className={cn(
						'size-5 shrink-0 transition-transform duration-200',
						isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
					)}
				/>
			</button>

			<div
				ref={accordion}
				className='transition-all duration-300 ease-in-out overflow-hidden'
				style={
					isOpen
						? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
						: { maxHeight: 0, opacity: 0 }
				}
				id={`accordion-content-${index}`}
				aria-labelledby={`accordion-trigger-${index}`}
				role='region'
				data-slot='accordion-content'
			>
				<div className='pb-6 pl-11 leading-relaxed text-muted-foreground'>
					{description}
				</div>
			</div>
		</li>
	);
};

/**
 * Media display component for feature demonstrations
 * Handles both video and image content with proper styling
 */
const MediaDisplay = ({ feature }: { feature: Feature }) => {
	const { type, path, format, alt } = feature;
	const style =
		'rounded-lg aspect-square w-full sm:w-[26rem] border border-border/20 shadow-lg';
	const size = {
		width: 500,
		height: 500,
	};

	if (type === 'video') {
		return (
			<video
				className={style}
				autoPlay
				muted
				loop
				playsInline
				controls
				width={size.width}
				height={size.height}
				aria-label={`Video demonstration of ${feature.title}`}
				title={feature.description}
				data-slot='feature-video'
			>
				<source
					src={path}
					type={format}
				/>
				Your browser does not support the video tag.
			</video>
		);
	} else if (type === 'image') {
		return (
			<Image
				src={path!}
				alt={alt!}
				className={`${style} object-cover object-center`}
				width={size.width}
				height={size.height}
				data-slot='feature-image'
			/>
		);
	} else {
		return (
			<Card className={`${style} !border-none bg-muted/30`}>
				<CardContent className='h-full flex items-center justify-center p-8'>
					<div className='text-center text-muted-foreground'>
						<div className='text-4xl mb-4'>🚀</div>
						<p className='text-sm'>Feature demonstration</p>
					</div>
				</CardContent>
			</Card>
		);
	}
};

/**
 * Interactive features component with accordion-style navigation and media display
 *
 * Features:
 * - Interactive accordion showing 2-5 features
 * - Media display for selected feature (video/image)
 * - Responsive layout with proper spacing
 * - Smooth animations and transitions
 * - Tailwind variable colors throughout
 * - Accessible keyboard navigation
 */
const InteractiveFeatures = () => {
	const [featureSelected, setFeatureSelected] = useState<number>(0);

	return (
		<section
			className='py-24 md:py-32 bg-background'
			id='features'
			aria-labelledby='features-heading'
			data-slot='features-section'
		>
			<div className='px-8 max-w-7xl mx-auto'>
				<div className='text-center mb-16 md:mb-24'>
					<Badge
						variant='secondary'
						className='mb-4'
					>
						There's a better way
					</Badge>
					<h2
						id='features-heading'
						className='font-extrabold text-4xl lg:text-6xl tracking-tight mb-6 text-foreground'
					>
						All you need to ship your startup in{' '}
						<span className='bg-primary text-primary-foreground px-3 md:px-4 rounded-lg whitespace-nowrap'>
							days, not months
						</span>
					</h2>
					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						Complete SaaS boilerplate with everything you need to launch quickly
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start'>
					{/* Accordion */}
					<Card className='bg-card/50 border-border backdrop-blur-sm'>
						<CardContent className='p-6'>
							<h3 className='sr-only'>Feature Categories</h3>
							<ul
								className='space-y-0'
								role='tablist'
								aria-label='Feature categories'
							>
								{features.map((feature, i) => (
									<AccordionItem
										key={feature.title}
										index={i}
										feature={feature}
										isOpen={featureSelected === i}
										setFeatureSelected={() => setFeatureSelected(i)}
									/>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Media Display */}
					<div
						className='flex justify-center lg:justify-start'
						role='tabpanel'
						aria-labelledby={`accordion-trigger-${featureSelected}`}
					>
						<MediaDisplay
							feature={features[featureSelected]}
							key={featureSelected}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default InteractiveFeatures;
