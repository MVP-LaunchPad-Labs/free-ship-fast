"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/oauth/google";
import GitHubIcon from "@/components/icons/oauth/github";
import { toast } from "sonner";

interface OAuthButtonProps {
	provider: "google" | "github";
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
	size?: "default" | "sm" | "lg" | "icon";
}

const providerIcons = {
	google: GoogleIcon,
	github: GitHubIcon,
};

export default function OAuthButton({
	provider,
	children,
	className,
	variant = "outline",
	size = "default",
}: OAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const ProviderIcon = providerIcons[provider];

	const handleOAuth = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social(
				{
					provider,
					callbackURL: "/dashboard",
				},
				{
					onSuccess: () => {
						toast.success("Signed in successfully");
					},
					onError: (error) => {
						toast.error("Sign in failed");
					},
				},
			);
		} catch (error) {
			console.error(`${provider} sign in failed:`, error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleOAuth}
			loading={isLoading}
			variant={variant}
			size={size}
			className={className}
			loadingText={`Signing in`}
		>
			<ProviderIcon className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);
}
