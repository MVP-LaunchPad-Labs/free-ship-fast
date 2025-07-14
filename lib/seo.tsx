import type { Metadata } from 'next';

import config from '@/config';

/**
 * Generate comprehensive SEO metadata for pages
 *
 * This utility creates optimized meta tags including:
 * - Title & description with length limits
 * - Open Graph social sharing tags
 * - Twitter Card metadata
 * - Canonical URLs for duplicate content prevention
 * - Structured data support
 *
 * Usage: export const metadata = generateSEOMetadata({canonicalUrlRelative: "/features"});
 */
export const generateSEOMetadata = ({
	title,
	description,
	keywords,
	openGraph,
	canonicalUrlRelative,
	additionalMetaTags,
}: Metadata & {
	canonicalUrlRelative?: string;
	additionalMetaTags?: Record<string, string>;
} = {}) => {
	return {
		// Primary title (50-60 chars optimal) - highlight your unique value proposition
		title: title || config.appName,
		// Meta description (150-160 chars optimal) - address your target audience's pain points
		description: description || config.appDescription,
		// Strategic keywords for search visibility - align with user search intent
		keywords: keywords || [config.appName],
		applicationName: config.appName,
		// Base URL configuration - automatically adjusts for different environments
		metadataBase: new URL(
			process.env.NODE_ENV === 'development'
				? 'http://localhost:3000/'
				: `https://${config.domainName}/`
		),

		openGraph: {
			title: openGraph?.title?.toString() || config.appName,
			description: openGraph?.description?.toString() || config.appDescription,
			url: openGraph?.url || `https://${config.domainName}/`,
			siteName: openGraph?.title?.toString() || config.appName,
			// Enable when you add custom social sharing images (place opengraph-image.* in /app folder)
			// images: [
			//   {
			//     url: `https://${config.domainName}/social-share.png`,
			//     width: 1200,
			//     height: 630,
			//   },
			// ],
			locale: 'en_US',
			type: 'website',
		},

		twitter: {
			title: openGraph?.title?.toString() || config.appName,
			description: openGraph?.description?.toString() || config.appDescription,
			// Enable when you add Twitter-specific images (place twitter-image.* in /app folder)
			// images: [openGraph?.image || defaultTwitterImage],
			card: 'summary_large_image',
			creator: '@your_twitter_handle',
		},

		// Canonical URL configuration prevents duplicate content penalties
		...(canonicalUrlRelative && {
			alternates: { canonical: canonicalUrlRelative },
		}),

		// Additional meta tags for enhanced SEO control (robots, viewport, etc.)
		...additionalMetaTags,
	};
};
