"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import config from "@/config";

interface SupportButtonProps {
	variant?: "default" | "outline" | "ghost";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

/**
 * Support button component with shadcn/ui styling
 *
 * Features:
 * - Integrates with Crisp chat when available
 * - Falls back to email support when Crisp is not configured
 * - Uses shadcn Button component with proper styling
 * - Accessible with tooltip and proper ARIA labels
 * - Configurable appearance via props
 */
const SupportButton = ({
	variant = "outline",
	size = "sm",
	className,
}: SupportButtonProps = {}) => {
	const handleClick = () => {
		try {
			// Try to access Crisp if it's available globally
			if (typeof window !== "undefined" && (window as any).$crisp) {
				(window as any).$crisp.push(["do", "chat:show"]);
				(window as any).$crisp.push(["do", "chat:open"]);
			} else if (config?.resend?.supportEmail) {
				// Open default email client with support subject
				window.open(
					`mailto:${config.resend.supportEmail}?subject=Need help with ${config.appName}`,
					"_blank",
				);
			} else {
				// Fallback to a generic contact method
				window.open("mailto:support@example.com?subject=Need help", "_blank");
			}
		} catch (error) {
			console.error("Support button error:", error);
			// Fallback to email if Crisp fails
			window.open("mailto:support@example.com?subject=Need help", "_blank");
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleClick}
			className={`gap-2 ${className || ""}`}
			title="Chat with support"
			data-slot="support-button"
		>
			<MessageCircle className="size-4" />
			Support
		</Button>
	);
};

export default SupportButton;
