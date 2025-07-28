'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
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
		} catch (error) {
			console.error(`${provider} sign in failed:`, error);
			toast.error('Sign in failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleOAuth}
			disabled={isLoading}
			className={className}
		>
			<ProviderIcon className='mr-2 h-5 w-5' />
			{children}
		</Button>
	);
}
