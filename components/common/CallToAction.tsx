import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Call-to-Action section component with shadcn/ui styling
 *
 * Features:
 * - Full-screen hero section with background image
 * - Overlay with proper opacity for text readability
 * - Centered content with responsive typography
 * - CTA button using shadcn Button component
 */
const CallToAction = () => {
	return (
		<section
			className='relative overflow-hidden min-h-screen flex items-center justify-center'
			aria-labelledby='cta-heading'
			data-slot='cta-section'
		>
			<Image
				src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
				alt='Professional dashboard analytics showcasing business intelligence and data visualization'
				width={500}
				height={500}
				className='w-full h-auto rounded-lg shadow-md'
			/>
			<div className='absolute inset-0 bg-background/70 backdrop-blur-sm' />
			<div className='relative text-center text-foreground p-8 z-10'>
				<div className='flex flex-col items-center max-w-xl mx-auto p-8 md:p-0'>
					<h2
						id='cta-heading'
						className='font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12 text-foreground'
					>
						Take your business to the next level
					</h2>
					<p className='text-lg text-muted-foreground mb-12 md:mb-16 leading-relaxed'>
						Join thousands of satisfied customers who have transformed their
						workflow with our powerful platform
					</p>
					<Button
						asChild
						size='lg'
						className='px-8'
						aria-label='Get started with our platform today'
					>
						<Link href='/#pricing'>Get Started Today</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
