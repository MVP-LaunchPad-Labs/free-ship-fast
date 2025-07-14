import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Hero section component with shadcn/ui styling
 *
 * Features:
 * - Split layout with text content and image
 * - Responsive design for mobile and desktop
 * - CTA button using shadcn Button component
 * - Tailwind variable colors for consistent theming
 */
const Hero = () => {
	return (
		<section
			className="max-w-7xl mx-auto bg-background flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20"
			data-slot="hero-section"
			aria-labelledby="hero-heading"
		>
			<div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
				<h1
					id="hero-heading"
					className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 text-foreground"
				>
					Build faster with our amazing template
				</h1>
				<p className="text-lg text-muted-foreground leading-relaxed">
					Get your startup off the ground quickly with our comprehensive
					boilerplate solution that includes everything you need
				</p>

				<Button
					asChild
					size="lg"
					className="px-8"
					aria-label="View pricing plans and get started"
				>
					<Link href="/#pricing">View Pricing</Link>
				</Button>
			</div>
			<div
				className="lg:w-full"
				role="img"
				aria-label="Hero section illustration"
			>
				<Image
					src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Professional software development workspace showing developers collaborating on code"
					width={500}
					height={500}
					className="w-full h-auto rounded-lg"
					priority={true}
				/>
			</div>
		</section>
	);
};

export default Hero;
