'use client';

import {
	ArrowRight,
	Check,
	Star,
	Shield,
	Zap,
	Users,
	BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function HomePage() {
	const { data: session } = authClient.useSession();

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-card to-background'>
			{/* Navigation */}
			<nav className='sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='flex h-16 items-center justify-between'>
						<div className='flex items-center'>
							<div className='text-xl font-bold'>FlashSaaS</div>
						</div>
						<div className='flex items-center gap-4'>
							<Button
								variant='ghost'
								asChild
							>
								<Link href='#pricing'>Pricing</Link>
							</Button>
							<Button
								variant='ghost'
								asChild
							>
								<Link href='#features'>Features</Link>
							</Button>
							{session ? (
								<Button asChild>
									<Link href='/dashboard'>Dashboard</Link>
								</Button>
							) : (
								<>
									<Button
										variant='ghost'
										asChild
									>
										<Link href='/signin'>Sign In</Link>
									</Button>
									<Button asChild>
										<Link href='/signup'>Get Started</Link>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-grid-muted/50 [mask-image:linear-gradient(0deg,transparent,black)]' />
				<div className='relative mx-auto max-w-7xl px-6 pt-20 pb-32 sm:pt-24 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<Badge
							variant='secondary'
							className='mb-4 px-3 py-1 text-sm font-medium'
						>
							<Zap className='mr-1 h-3 w-3' />
							Ship your SaaS in minutes
						</Badge>

						<h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-6xl'>
							The fastest way to build{' '}
							<span className='bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent'>
								your SaaS
							</span>
						</h1>

						<p className='mt-6 text-lg leading-8 text-muted-foreground'>
							Complete Next.js SaaS boilerplate with authentication, payments,
							database, and deployment. Skip months of setup and focus on what
							makes your product unique.
						</p>

						<div className='mt-10 flex items-center justify-center gap-x-6'>
							<Button
								size='lg'
								className='h-12 px-8'
								asChild
							>
								<Link href='/signup'>
									Start Building Today
									<ArrowRight className='ml-2 h-4 w-4' />
								</Link>
							</Button>
							<Button
								variant='outline'
								size='lg'
								className='h-12 px-8'
								asChild
							>
								<Link href='#demo'>View Demo</Link>
							</Button>
						</div>

						<div className='mt-8 flex items-center justify-center gap-x-2 text-sm text-muted-foreground'>
							<Check className='h-4 w-4 text-chart-4' />
							One-time purchase
							<span className='mx-2'>•</span>
							<Check className='h-4 w-4 text-chart-4' />
							Lifetime updates
							<span className='mx-2'>•</span>
							<Check className='h-4 w-4 text-chart-4' />
							Source code included
						</div>
					</div>
				</div>
			</section>

			{/* Social Proof */}
			<section className='py-16 bg-card/50'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<p className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
							Trusted by 500+ developers
						</p>
						<div className='mt-8 flex items-center justify-center gap-x-8 opacity-60'>
							<div className='flex items-center gap-x-1'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className='h-4 w-4 fill-chart-3 text-chart-3'
									/>
								))}
								<span className='ml-2 text-sm text-muted-foreground'>
									4.9/5 • 127 reviews
								</span>
							</div>
						</div>
						<div className='mt-6 grid grid-cols-3 gap-8 items-center justify-center text-center'>
							<div>
								<div className='text-2xl font-bold text-foreground'>$2.1M+</div>
								<div className='text-sm text-muted-foreground'>
									Revenue generated
								</div>
							</div>
							<div>
								<div className='text-2xl font-bold text-foreground'>47</div>
								<div className='text-sm text-muted-foreground'>
									Live SaaS apps
								</div>
							</div>
							<div>
								<div className='text-2xl font-bold text-foreground'>72h</div>
								<div className='text-sm text-muted-foreground'>
									Avg. launch time
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='py-24 bg-background'
			>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
							Everything you need. Nothing you don't.
						</h2>
						<p className='mt-4 text-lg text-muted-foreground'>
							Production-ready components and integrations that typically take
							months to build
						</p>
					</div>

					<div className='mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
						{[
							{
								icon: <Shield className='h-6 w-6' />,
								title: 'Auth & Security',
								desc: 'Google OAuth, magic links, rate limiting, and CSRF protection',
							},
							{
								icon: <BarChart className='h-6 w-6' />,
								title: 'Payments & Billing',
								desc: 'Stripe integration with subscriptions, invoices, and webhooks',
							},
							{
								icon: <Users className='h-6 w-6' />,
								title: 'User Management',
								desc: 'Complete dashboard with profiles, teams, and permissions',
							},
							{
								icon: <Zap className='h-6 w-6' />,
								title: 'Database & ORM',
								desc: 'Prisma with PostgreSQL, migrations, and type safety',
							},
							{
								icon: <Check className='h-6 w-6' />,
								title: 'Email System',
								desc: 'Transactional emails, templates, and delivery tracking',
							},
							{
								icon: <Star className='h-6 w-6' />,
								title: 'Analytics & SEO',
								desc: 'Built-in analytics, meta tags, and sitemap generation',
							},
						].map((feature, idx) => (
							<div
								key={idx}
								className='relative rounded-2xl border border-border p-8 hover:shadow-lg transition-all hover:border-primary/50 bg-card'
							>
								<div className='text-primary mb-4'>{feature.icon}</div>
								<h3 className='text-lg font-semibold text-foreground'>
									{feature.title}
								</h3>
								<p className='mt-2 text-muted-foreground'>{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section
				id='pricing'
				className='py-24 bg-card/50'
			>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
							Simple, transparent pricing
						</h2>
						<p className='mt-4 text-lg text-muted-foreground'>
							Get everything you need to build and launch your SaaS
						</p>
					</div>

					<div className='mt-16 flex justify-center'>
						<div className='rounded-3xl border border-border p-8 bg-background shadow-lg max-w-sm w-full'>
							<div className='text-center'>
								<h3 className='text-lg font-semibold text-foreground'>
									Complete SaaS Kit
								</h3>
								<div className='mt-4 flex items-baseline justify-center gap-x-2'>
									<span className='text-5xl font-bold tracking-tight text-foreground'>
										$197
									</span>
									<span className='text-sm font-semibold text-muted-foreground'>
										one-time
									</span>
								</div>
								<p className='mt-6 text-sm leading-6 text-muted-foreground'>
									Everything you need to launch your SaaS
								</p>
								<ul className='mt-8 space-y-3 text-sm leading-6 text-muted-foreground text-left'>
									{[
										'Complete Next.js 14 codebase',
										'Authentication & user management',
										'Stripe payments & subscriptions',
										'Database setup & migrations',
										'Email templates & sending',
										'Admin dashboard & analytics',
										'SEO optimization & meta tags',
										'Deployment guides & scripts',
										'Lifetime updates & support',
										'Commercial license included',
									].map((feature) => (
										<li
											key={feature}
											className='flex gap-x-3'
										>
											<Check className='h-5 w-5 flex-none text-chart-4' />
											{feature}
										</li>
									))}
								</ul>
								<Button
									className='mt-8 w-full'
									size='lg'
									asChild
								>
									<Link href='/purchase'>
										Get instant access
										<ArrowRight className='ml-2 h-4 w-4' />
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-24 bg-gradient-to-r from-primary to-chart-1'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl'>
							Ready to build your SaaS?
						</h2>
						<p className='mt-4 text-xl text-primary-foreground/80'>
							Stop reinventing the wheel. Start with a proven foundation.
						</p>
						<div className='mt-8 flex gap-4 justify-center'>
							<Button
								size='lg'
								variant='secondary'
								className='h-12 px-8'
								asChild
							>
								<Link href='/sign-up'>
									Start Building Now
									<ArrowRight className='ml-2 h-4 w-4' />
								</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								className='h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10'
								asChild
							>
								<Link href='#demo'>View Live Demo</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='border-t border-border bg-background'>
				<div className='mx-auto max-w-7xl px-6 py-12 lg:px-8'>
					<div className='flex justify-between items-center'>
						<div className='text-sm text-muted-foreground'>
							© 2024 FlashSaaS. All rights reserved.
						</div>
						<div className='flex gap-6 text-sm'>
							<Link
								href='/privacy'
								className='text-muted-foreground hover:text-foreground'
							>
								Privacy
							</Link>
							<Link
								href='/terms'
								className='text-muted-foreground hover:text-foreground'
							>
								Terms
							</Link>
							<Link
								href='/contact'
								className='text-muted-foreground hover:text-foreground'
							>
								Contact
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
