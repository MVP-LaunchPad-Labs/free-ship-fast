"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/app/icon.svg";
import config from "@/config";
import SignInButton from "./SignInButton";
import ThemeSwitch from "./ThemeSwitch";

/**
 * Navigation links configuration
 */
const links: {
	href: string;
	label: string;
}[] = [
	{
		href: "/#pricing",
		label: "Pricing",
	},
	{
		href: "/#faq",
		label: "FAQ",
	},
];

/**
 * Responsive header component with shadcn/ui styling
 *
 * Features:
 * - Logo and app name on the left
 * - Navigation links in center (desktop) / drawer (mobile)
 * - Theme switcher and CTA button on the right
 * - Mobile-responsive with sheet component
 * - Uses tailwind variable colors for theming
 */
const Header = () => {
	const searchParams = useSearchParams();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Close mobile menu when route changes
	useEffect(() => {
		setIsOpen(false);
	}, [searchParams]);

	return (
		<>
			{/* Skip to main content link for screen readers */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-medium"
			>
				Skip to main content
			</a>

			<header className="bg-background border-b border-border sticky top-0 z-40">
				<nav
					className="container flex items-center justify-between px-8 py-4 mx-auto"
					aria-label="Primary navigation"
					role="navigation"
					data-slot="header-nav"
				>
					{/* Logo section */}
					<div className="flex lg:flex-1">
						<Link
							className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
							href="/"
							title={`${config.appName} homepage`}
							data-slot="logo-link"
						>
							<Image
								src={logo}
								alt={`${config.appName} logo`}
								className="size-8"
								priority={true}
								width={32}
								height={32}
							/>
							<span className="font-extrabold text-lg text-foreground">
								{config.appName}
							</span>
						</Link>
					</div>

					{/* Desktop navigation */}
					<nav
						className="hidden lg:flex lg:justify-center lg:gap-8 lg:items-center"
						aria-label="Main navigation"
					>
						<ul className="flex gap-8 items-center" role="menubar">
							{links.map((link) => (
								<li key={link.href} role="none">
									<Link
										href={link.href}
										className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
										title={link.label}
										role="menuitem"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Desktop CTA */}
					<div className="hidden lg:flex lg:justify-end lg:flex-1 lg:items-center lg:gap-2">
						<ThemeSwitch />
						<SignInButton />
					</div>

					{/* Mobile menu */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="lg:hidden">
							<Button
								variant="ghost"
								size="icon"
								aria-label="Open main menu"
								data-slot="mobile-menu-trigger"
							>
								<Menu className="size-6" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="w-full sm:max-w-sm bg-background border-border"
							data-slot="mobile-menu-content"
						>
							<div className="flex flex-col h-full">
								{/* Mobile logo */}
								<div className="flex items-center gap-2 mb-8">
									<Image
										src={logo}
										alt={`${config.appName} logo`}
										className="size-8"
										priority={true}
										width={32}
										height={32}
									/>
									<span className="font-extrabold text-lg text-foreground">
										{config.appName}
									</span>
								</div>

								{/* Mobile navigation links */}
								<nav
									className="flex flex-col gap-4 mb-8"
									aria-label="Mobile navigation"
								>
									<ul className="flex flex-col gap-4" role="menu">
										{links.map((link) => (
											<li key={link.href} role="none">
												<Link
													href={link.href}
													className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
													title={link.label}
													onClick={() => setIsOpen(false)}
													role="menuitem"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</nav>

								{/* Mobile CTA */}
								<div className="mt-auto flex flex-col gap-4">
									<ThemeSwitch />
									<SignInButton />
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</nav>
			</header>
		</>
	);
};

export default Header;
