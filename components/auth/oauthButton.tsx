'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/icons/oauth/google';
import GitHubIcon from '@/components/icons/oauth/github';
import { toast } from 'sonner';
import config from '@/config';

interface OAuthButtonProps {
	provider: 'google' | 'github';
	children: React.ReactNode;
	className?: string;
	variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
	size?: 'default' | 'sm' | 'lg' | 'icon';
}

const providerIcons = {
	google: GoogleIcon,
	github: GitHubIcon,
};

// OAuth abstraction layer
interface OAuthProvider {
	signIn(provider: 'google' | 'github'): Promise<void>;
}

// Supabase OAuth implementation
const supabaseAuth: OAuthProvider = {
	async signIn(provider: 'google' | 'github') {
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo:
					config.auth.supabase?.redirectTo ||
					`${window.location.origin}/auth/callback?redirect=/dashboard`,
			},
		});

		if (error) {
			throw error;
		}
	},
};

// Better Auth OAuth implementation
const betterAuth: OAuthProvider = {
	async signIn(provider: 'google' | 'github') {
		await authClient.signIn.social(
			{
				provider,
				callbackURL: config.auth.callbackUrl,
			},
			{
				onSuccess: () => {
					toast.success('Signed in successfully');
				},
				onError: (error) => {
					toast.error('Sign in failed');
				},
			}
		);
	},
};

// Automatically choose OAuth implementation based on config
const getOAuthProvider = (): OAuthProvider => {
	switch (config.services.auth) {
		case 'supabase':
			return supabaseAuth;
		case 'better-auth':
			return betterAuth;
		default:
			return betterAuth; // Default fallback
	}
};

export default function OAuthButton({
	provider,
	children,
	className,
	variant = 'outline',
	size = 'default',
}: OAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const ProviderIcon = providerIcons[provider];
	const oauthProvider = getOAuthProvider();

	const handleOAuth = async () => {
		setIsLoading(true);
		try {
			await oauthProvider.signIn(provider);
		} catch (error) {
			console.error(`${provider} sign in failed:`, error);
			// Only show toast error for Supabase (Better Auth handles its own)
			if (config.services.auth === 'supabase') {
				toast.error('Sign in failed');
			}
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
			<ProviderIcon className='mr-2 h-4 w-4' />
			{children}
		</Button>
	);
}
