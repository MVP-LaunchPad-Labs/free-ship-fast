export interface ConfigProps {
	appName: string;
	appDescription: string;
	domainName: string;
	stripe: {
		plans: {
			isFeatured?: boolean;
			priceId: string;
			name: string;
			description?: string;
			price: number;
			priceAnchor?: number;
			features: {
				name: string;
			}[];
		}[];
	};
	resend: {
		fromNoReply: string;
		fromAdmin: string;
		supportEmail?: string;
		forwardRepliesTo?: string;
	};
	auth: {
		loginUrl: string;
		callbackUrl: string;
	};
}
