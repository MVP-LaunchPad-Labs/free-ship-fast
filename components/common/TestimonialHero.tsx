import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Hero-style testimonial component with shadcn/ui styling
 *
 * Features:
 * - Beautiful background with gradient patterns
 * - Uses shadcn Card and Avatar components
 * - Responsive design for mobile and desktop
 * - Uses tailwind variable colors for consistent theming
 */
const TestimonialHero = () => {
	return (
		<section
			className="relative isolate overflow-hidden bg-background px-8 py-24 sm:py-32"
			id="testimonials"
			data-slot="testimonial-section"
		>
			<div className="absolute inset-0 -z-10 bg-gradient-radial from-muted/40 to-background opacity-60" />
			<div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-lg ring-1 ring-border sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

			<div className="mx-auto max-w-2xl lg:max-w-5xl">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						What our customers say
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						See how our platform has helped businesses like yours succeed
					</p>
				</div>

				<Card className="mt-10 bg-card/50 border-border backdrop-blur-sm">
					<CardContent className="p-8 sm:p-12">
						<div className="flex flex-col lg:flex-row items-center gap-12">
							<div className="relative rounded-xl border border-border bg-muted/30 p-1.5 sm:-rotate-1 shadow-lg shrink-0">
								<Image
									src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
									alt="David Park - CEO"
									width={60}
									height={60}
									className="rounded-md ring-2 ring-border size-20 object-cover"
								/>
							</div>

							<div className="flex-1">
								<blockquote className="text-xl font-medium leading-8 text-foreground sm:text-2xl sm:leading-10">
									"This platform has completely transformed how we manage our
									business. The authentication system and payment integration
									saved us weeks of development time. The documentation is
									excellent and the support team is incredibly responsive.
									Highly recommended!"
								</blockquote>
								<figcaption className="mt-10 flex items-center justify-start gap-5">
									<div className="text-base">
										<div className="font-semibold text-foreground mb-0.5">
											Jordan Smith
										</div>
										<div className="text-muted-foreground">
											Founder & CEO, TechStart
										</div>
									</div>
								</figcaption>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default TestimonialHero;
