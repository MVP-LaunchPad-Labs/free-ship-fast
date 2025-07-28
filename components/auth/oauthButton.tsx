'use client';

import { useState } from 'react';
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

// Sign in with OAuth using Supabase
const signInWithOAuth = async (provider: 'google' | 'github') => {
	const supabase = createClient();
	const { error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: config.auth.redirectTo,
		},
	});

	if (error) {
		throw error;
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

	const handleOAuth = async () => {
		setIsLoading(true);
		try {
			await signInWithOAuth(provider);
		} catch (error) {
			console.error(`${provider} sign in failed:`, error);
			toast.error('Sign in failed');
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
