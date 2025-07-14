import type { ConfigProps } from "@/types/config";

const config: ConfigProps = {
	appName: "YourAppName",
	appDescription:
		"A brief description of what your app does and its main value proposition.",
	domainName: "yourdomain.com",
	stripe: {
		plans: [
			{
				priceId:
					process.env.NODE_ENV === "development"
						? "price_dev_xxxxxxxxxxxxxxxxx"
						: "price_prod_xxxxxxxxxxxxxxxxx",
				name: "Basic Plan",
				description: "Perfect for getting started",
				price: 9.99,
				features: [
					{ name: "Feature 1" },
					{ name: "Feature 2" },
					{ name: "Feature 3" },
				],
			},
			{
				priceId:
					process.env.NODE_ENV === "development"
						? "price_dev_xxxxxxxxxxxxxxxxx"
						: "price_prod_xxxxxxxxxxxxxxxxx",
				isFeatured: true,
				name: "Pro Plan",
				description: "Most popular choice",
				price: 19.99,
				features: [
					{ name: "Everything in Basic" },
					{ name: "Advanced Feature 1" },
					{ name: "Advanced Feature 2" },
					{ name: "Priority support" },
				],
			},
		],
	},
	resend: {
		fromNoReply:
			process.env.RESEND_FROM_EMAIL || "YourAppName <noreply@yourdomain.com>",
		fromAdmin: "Your Name at YourAppName <yourname@yourdomain.com>",
		supportEmail: "support@yourdomain.com",
		forwardRepliesTo: "your.email@gmail.com",
	},
	auth: {
		loginUrl: "/sign-in",
		callbackUrl: "/dashboard",
	},
};

export default config;
