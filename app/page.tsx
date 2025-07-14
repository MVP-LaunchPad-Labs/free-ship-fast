'use client';

import Header from '@/components/common/Header';
import Hero from '@/components/common/Hero';
import CustomerAvatars from '@/components/common/CustomerAvatars';
import FeatureGrid from '@/components/common/FeatureGrid';
import InteractiveFeatures from '@/components/common/InteractiveFeatures';
import TestimonialHero from '@/components/common/TestimonialHero';
import TestimonialGrid from '@/components/common/TestimonialGrid';
import Pricing from '@/components/common/Pricing';
import CallToAction from '@/components/common/CallToAction';
import FAQ from '@/components/common/FAQ';
import Footer from '@/components/common/Footer';

export default function HomePage() {
	return (
		<div className='min-h-screen bg-background'>
			<Header />

			<main
				id='main-content'
				role='main'
			>
				<Hero />

				{/* Social Proof Section */}
				<section
					className='py-16 bg-card/50'
					aria-label='Social proof and customer testimonials'
				>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<div className='mx-auto max-w-2xl text-center'>
							<p className='text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-8'>
								Trusted by 500+ developers
							</p>
							<CustomerAvatars priority />
						</div>
					</div>
				</section>

				<FeatureGrid />
				<InteractiveFeatures />
				<TestimonialHero />
				<TestimonialGrid />
				<Pricing />
				<FAQ />
				<CallToAction />
			</main>

			<Footer />
		</div>
	);
}
