"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SupportButton from "@/components/common/SupportButton";
import GradientButton from "@/components/common/GradientButton";

/**
 * 404 Not Found page using common components
 *
 * Features:
 * - Uses Header and Footer from common components
 * - Support button for user assistance
 * - Gradient button for visual appeal
 * - Helpful navigation options
 * - Clean design with shadcn/ui components
 */
export default function NotFound() {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />

			<main className="flex-1 flex items-center justify-center px-6 py-24">
				<div className="text-center max-w-2xl mx-auto">
					{/* Error Badge */}
					<Badge variant="destructive" className="mb-6 text-lg px-4 py-2">
						404 Error
					</Badge>

					{/* Main Error Message */}
					<h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4">
						404
					</h1>

					<h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
						Page Not Found
					</h2>

					<p className="text-lg text-muted-foreground mb-12 leading-relaxed">
						Oops! The page you're looking for doesn't exist. It might have been
						moved, deleted, or you entered the wrong URL.
					</p>

					{/* Action Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Search className="size-5" />
									What can you do?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-left">
								<p className="text-sm text-muted-foreground">
									• Check the URL for typos
								</p>
								<p className="text-sm text-muted-foreground">
									• Go back to the previous page
								</p>
								<p className="text-sm text-muted-foreground">
									• Visit our homepage
								</p>
								<p className="text-sm text-muted-foreground">
									• Contact our support team
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<MessageCircle className="size-5" />
									Need Help?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-muted-foreground text-left">
									Our support team is here to help you find what you're looking
									for.
								</p>
								<SupportButton />
							</CardContent>
						</Card>
					</div>

					{/* Navigation Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button
							size="lg"
							variant="default"
							className="w-full sm:w-auto"
							asChild
						>
							<Link href="/">
								<Home className="size-4 mr-2" />
								Go to Homepage
							</Link>
						</Button>

						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto"
							onClick={() => window.history.back()}
						>
							<ArrowLeft className="size-4 mr-2" />
							Go Back
						</Button>

						<GradientButton
							title="Get Support"
							onClick={() => {
								// Scroll to support card or trigger support
								document
									.querySelector('[data-slot="support-button"]')
									?.scrollIntoView({
										behavior: "smooth",
									});
							}}
							className="w-full sm:w-auto"
						/>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
