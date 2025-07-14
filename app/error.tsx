'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
	RefreshCw,
	Home,
	AlertTriangle,
	Bug,
	MessageCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SupportButton from '@/components/common/SupportButton';
import GradientButton from '@/components/common/GradientButton';

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * Error page using common components
 *
 * Features:
 * - Uses Header and Footer from common components
 * - Support button for user assistance
 * - Gradient button for visual appeal
 * - Error details and recovery options
 * - Clean design with shadcn/ui components
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Application error:', error);
	}, [error]);

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<Header />

			<main className='flex-1 flex items-center justify-center px-6 py-24'>
				<div className='text-center max-w-2xl mx-auto'>
					{/* Error Badge */}
					<Badge
						variant='destructive'
						className='mb-6 text-lg px-4 py-2'
					>
						<AlertTriangle className='size-4 mr-2' />
						Application Error
					</Badge>

					{/* Main Error Message */}
					<h1 className='text-4xl md:text-6xl font-bold text-foreground mb-4'>
						Oops!
					</h1>

					<h2 className='text-2xl md:text-3xl font-semibold text-foreground mb-6'>
						Something went wrong
					</h2>

					<p className='text-lg text-muted-foreground mb-8 leading-relaxed'>
						We encountered an unexpected error. Don't worry, our team has been
						notified and is working to fix this issue.
					</p>

					{/* Error Details Card */}
					{error.message && (
						<Alert className='mb-8 text-left'>
							<Bug className='h-4 w-4' />
							<AlertDescription className='text-sm font-mono'>
								<strong>Error:</strong> {error.message}
								{error.digest && (
									<div className='mt-2 text-xs text-muted-foreground'>
										Error ID: {error.digest}
									</div>
								)}
							</AlertDescription>
						</Alert>
					)}

					{/* Action Cards */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
						<Card className='hover:shadow-lg transition-shadow'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<RefreshCw className='size-5' />
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-sm text-muted-foreground text-left mb-4'>
									Try these steps to resolve the issue:
								</p>
								<div className='space-y-2 text-left text-sm text-muted-foreground'>
									<p>• Refresh the page</p>
									<p>• Clear your browser cache</p>
									<p>• Try again in a few minutes</p>
									<p>• Go back to the homepage</p>
								</div>
							</CardContent>
						</Card>

						<Card className='hover:shadow-lg transition-shadow'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<MessageCircle className='size-5' />
									Still Having Issues?
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-sm text-muted-foreground text-left'>
									Contact our support team with the error details above. We'll
									help you get back on track quickly.
								</p>
								<SupportButton />
							</CardContent>
						</Card>
					</div>

					{/* Action Buttons */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Button
							size='lg'
							variant='default'
							className='w-full sm:w-auto'
							onClick={reset}
						>
							<RefreshCw className='size-4 mr-2' />
							Try Again
						</Button>

						<Button
							size='lg'
							variant='outline'
							className='w-full sm:w-auto'
							asChild
						>
							<Link href='/'>
								<Home className='size-4 mr-2' />
								Go to Homepage
							</Link>
						</Button>

						<GradientButton
							title='Get Support'
							onClick={() => {
								// Trigger support with error context
								if (typeof window !== 'undefined') {
									// You could pass error context to support here
									document
										.querySelector('[data-slot="support-button"]')
										?.scrollIntoView({
											behavior: 'smooth',
										});
								}
							}}
							className='w-full sm:w-auto'
						/>
					</div>

					{/* Additional Help */}
					<div className='mt-12 text-center'>
						<p className='text-sm text-muted-foreground'>
							Error occurred at {new Date().toLocaleString()}
						</p>
						{error.digest && (
							<p className='text-xs text-muted-foreground mt-1'>
								Reference: {error.digest}
							</p>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
