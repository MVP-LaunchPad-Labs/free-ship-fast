'use client';

import * as React from 'react';
import { useState } from 'react';
import { CreditCard, LogOut, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import apiClient from '@/lib/api';

/**
 * User account dropdown menu using shadcn/ui components
 *
 * Features:
 * - User avatar with fallback to initials
 * - Billing portal access (requires Stripe Customer Portal activation)
 * - Sign out functionality using better-auth
 * - Responsive design with tailwind variable colors
 */
const UserAccountMenu = () => {
	const { data: session } = authClient.useSession();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/';
				},
			},
		});
	};

	const handleBilling = async () => {
		setIsLoading(true);

		try {
			const { url }: { url: string } = await apiClient.post(
				'/stripe/create-portal',
				{
					returnUrl: window.location.href,
				}
			);

			window.location.href = url;
		} catch (e) {
			console.error(e);
		}

		setIsLoading(false);
	};

	if (!session) return null;

	const user = session.user;
	const displayName = user.name || user.email?.split('@')[0] || 'Account';
	const avatarFallback = user.email?.charAt(0).toUpperCase() || 'U';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='default'
					className='gap-2 bg-background hover:bg-accent hover:text-accent-foreground border-border'
					disabled={isLoading}
					data-slot='account-button'
				>
					<Avatar className='size-6'>
						<AvatarImage
							src={user.image || ''}
							alt='Profile picture'
							className='object-cover'
						/>
						<AvatarFallback className='bg-muted text-muted-foreground text-xs'>
							{avatarFallback}
						</AvatarFallback>
					</Avatar>

					<span className='hidden sm:inline-block'>{displayName}</span>

					{isLoading && <Loader2 className='size-4 animate-spin' />}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='w-56 bg-popover border-border shadow-md'
				data-slot='account-dropdown'
			>
				<DropdownMenuItem
					onClick={handleBilling}
					className='gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground'
				>
					<CreditCard className='size-4' />
					Billing
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={handleSignOut}
					className='gap-2 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive'
				>
					<LogOut className='size-4' />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccountMenu;
