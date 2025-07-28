'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import config from '@/config';

interface SignInButtonProps {
	extraStyle?: string;
}

/**
 * Sign-in button component using Supabase
 *
 * Features:
 * - Automatically redirects authenticated users to dashboard
 * - Uses Supabase session management
 * - Styled with shadcn/ui button component
 * - Supports custom styling via extraStyle prop
 */
const SignInButton = ({ extraStyle }: SignInButtonProps) => {
	const [session, setSession] = useState<any>(null);
	const supabase = createClient();

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);

	// If user is authenticated, redirect to dashboard
	if (session) {
		return (
			<Button
				asChild
				variant='default'
				className={extraStyle}
				data-slot='dashboard-button'
			>
				<a href={config.auth.callbackUrl}>Dashboard</a>
			</Button>
		);
	}

	// Show sign-in button for unauthenticated users
	return (
		<Button
			asChild
			variant='default'
			className={extraStyle}
			data-slot='signin-button'
		>
			<a href={config.auth.loginUrl}>Get Started</a>
		</Button>
	);
};

export default SignInButton;
