'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

const emailSchema = z.object({
	email: z.email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

interface MagicLinkProps {
	onSuccess?: () => void;
	redirectUrl?: string;
	className?: string;
}

const ERROR_MESSAGES = {
	TOO_MANY_REQUESTS: 'Too many attempts. Wait a few minutes and try again.',
	INVALID_EMAIL: 'Please enter a valid email address.',
	NETWORK_ERROR: 'Connection error. Check your internet and try again.',
	DEFAULT: 'Something went wrong. Please try again.',
	MAX_RESET_ATTEMPTS:
		'Too many reset attempts. Please wait before trying again.',
} as const;

const SuccessState = ({
	email,
	onReset,
}: {
	email: string;
	onReset: () => void;
}) => (
	<div className='text-center space-y-3 min-h-[110px] flex flex-col justify-center items-center'>
		<div className='text-sm text-green-600'>✓ Magic link sent to {email}</div>
		<div className='text-xs text-muted-foreground'>
			Check your inbox and spam folder
		</div>
		<Button
			variant='outline'
			size='sm'
			onClick={onReset}
		>
			Send to different email
		</Button>
	</div>
);

const EmailForm = ({
	form,
	isLoading,
	onSubmit,
}: {
	form: ReturnType<typeof useForm<EmailForm>>;
	isLoading: boolean;
	onSubmit: (data: EmailForm) => void;
	className?: string;
}) => (
	<Form {...form}>
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='space-y-4 min-h-[110px] '
		>
			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								type='email'
								placeholder='you@example.com'
								disabled={isLoading}
								autoComplete='email'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button
				type='submit'
				className='w-full'
				loading={isLoading}
				disabled={isLoading}
			>
				Continue
			</Button>
		</form>
	</Form>
);

const handleError = (error: any) => {
	if (error?.code && error.code in ERROR_MESSAGES) {
		toast.error(ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]);
	} else if (error?.message?.includes('network')) {
		toast.error(ERROR_MESSAGES.NETWORK_ERROR);
	} else {
		toast.error(ERROR_MESSAGES.DEFAULT);
	}
};

export default function MagicLink({
	onSuccess,
	redirectUrl = '/dashboard',
	className,
}: MagicLinkProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const [sendAttempts, setSendAttempts] = useState(0);
	const [resetAttempts, setResetAttempts] = useState(0);
	const [lastSentTime, setLastSentTime] = useState<number | null>(null);

	const MAX_SEND_ATTEMPTS = 5;
	const MAX_RESET_ATTEMPTS = 3;
	const RATE_LIMIT_WINDOW = 60000; // 1 minute

	const form = useForm<EmailForm>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: '' },
	});

	const onSubmit = async (data: EmailForm) => {
		// Check rate limiting
		if (sendAttempts >= MAX_SEND_ATTEMPTS) {
			toast.error(ERROR_MESSAGES.TOO_MANY_REQUESTS);
			return;
		}

		if (lastSentTime && Date.now() - lastSentTime < RATE_LIMIT_WINDOW) {
			const waitTime = Math.ceil(
				(RATE_LIMIT_WINDOW - (Date.now() - lastSentTime)) / 1000
			);
			toast.error(`Please wait ${waitTime} seconds before trying again.`);
			return;
		}

		setIsLoading(true);
		try {
			await authClient.signIn.magicLink({
				email: data.email,
				callbackURL: redirectUrl,
			});
			toast.success('Check your email and click the link to sign in.');
			setIsSent(true);
			setSendAttempts((prev) => prev + 1);
			setLastSentTime(Date.now());
			onSuccess?.();
		} catch (error) {
			console.error('Magic link error:', error);
			setSendAttempts((prev) => prev + 1);
			handleError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		if (resetAttempts >= MAX_RESET_ATTEMPTS) {
			toast.error(ERROR_MESSAGES.MAX_RESET_ATTEMPTS);
			return;
		}
		setResetAttempts((prev) => prev + 1);
		setIsSent(false);
	};

	if (isSent) {
		return (
			<SuccessState
				email={form.getValues('email')}
				onReset={handleReset}
			/>
		);
	}

	return (
		<div className={className}>
			<EmailForm
				form={form}
				isLoading={isLoading}
				onSubmit={onSubmit}
			/>
		</div>
	);
}
