import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import config from "@/config";
import logo from "@/app/icon.svg";

/**
 * Site footer component with shadcn/ui styling
 *
 * Features:
 * - Company branding and description
 * - Navigation links and legal pages
 * - Responsive layout with tailwind variable colors
 * - Copyright notice with current year
 * - Conditional support email link
 */
const Footer = () => {
	return (
		<footer
			className="bg-muted/30 border-t border-border"
			data-slot="site-footer"
		>
			<div className="max-w-7xl mx-auto px-8 py-24">
				<div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
					{/* Brand section */}
					<div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
						<Link
							href="/#"
							aria-current="page"
							className="flex gap-2 justify-center md:justify-start items-center hover:opacity-80 transition-opacity"
							data-slot="footer-logo"
						>
							<Image
								src={logo}
								alt={`${config.appName} logo`}
								priority={true}
								className="size-6"
								width={24}
								height={24}
							/>
							<strong className="font-extrabold tracking-tight text-base md:text-lg text-foreground">
								{config.appName}
							</strong>
						</Link>

						<p className="mt-3 text-sm text-muted-foreground">
							{config.appDescription}
						</p>
						<p className="mt-3 text-sm text-muted-foreground/60">
							Copyright © {new Date().getFullYear()} - All rights reserved
						</p>
					</div>

					{/* Links sections */}
					<div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
						{/* Main links */}
						<div className="lg:w-1/3 md:w-1/2 w-full px-4">
							<div className="font-semibold text-foreground tracking-widest text-sm md:text-left mb-3">
								LINKS
							</div>

							<div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
								{config.resend?.supportEmail && (
									<a
										href={`mailto:${config.resend.supportEmail}`}
										target="_blank"
										className="text-muted-foreground hover:text-foreground transition-colors"
										aria-label="Contact Support"
										rel="noopener noreferrer"
									>
										Support
									</a>
								)}
								<Link
									href="/#pricing"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Pricing
								</Link>
							</div>
						</div>

						{/* Legal links */}
						<div className="lg:w-1/3 md:w-1/2 w-full px-4">
							<div className="font-semibold text-foreground tracking-widest text-sm md:text-left mb-3">
								LEGAL
							</div>

							<div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
								<Link
									href="/tos"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
								<Link
									href="/privacy-policy"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
