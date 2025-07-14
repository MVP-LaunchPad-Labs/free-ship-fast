"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import config from "@/config";

interface SignInButtonProps {
	extraStyle?: string;
}

/**
 * Sign-in button component using better-auth
 *
 * Features:
 * - Automatically redirects authenticated users to dashboard
 * - Uses better-auth session management
 * - Styled with shadcn/ui button component
 * - Supports custom styling via extraStyle prop
 */
const SignInButton = ({ extraStyle }: SignInButtonProps) => {
	const { data: session } = authClient.useSession();

	// If user is authenticated, redirect to dashboard
	if (session) {
		return (
			<Button
				asChild
				variant="default"
				className={extraStyle}
				data-slot="dashboard-button"
			>
				<a href={config.auth.callbackUrl}>Dashboard</a>
			</Button>
		);
	}

	// Show sign-in button for unauthenticated users
	return (
		<Button
			asChild
			variant="default"
			className={extraStyle}
			data-slot="signin-button"
		>
			<a href={config.auth.loginUrl}>Get Started</a>
		</Button>
	);
};

export default SignInButton;
