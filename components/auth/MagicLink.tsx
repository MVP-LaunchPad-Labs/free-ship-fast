'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { auth } from '@/lib/auth';
import { Mail, RefreshCw } from 'lucide-react';

const emailSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

interface MagicLinkProps {
	onSuccess?: () => void;
	redirectUrl?: string;
	className?: string;
}

const ERROR_MESSAGES = {
	INVALID_EMAIL: 'Please enter a valid email address.',
	GENERIC: 'Failed to send magic link. Please try again.',
	TOO_MANY_REQUESTS: 'Too many attempts. Please wait before trying again.',
	MAX_RESET_ATTEMPTS:
		'Maximum reset attempts reached. Please refresh the page.',
} as const;

const handleError = (error: unknown) => {
	const message =
		error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
	toast.error(message);
};

interface SuccessStateProps {
	email: string;
	onReset: () => void;
}

const SuccessState = ({ email, onReset }: SuccessStateProps) => (
	<Card className='border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950'>
		<CardContent className='p-6 text-center space-y-4'>
			<div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto'>
				<Mail className='w-6 h-6 text-green-600 dark:text-green-400' />
			</div>
			<div className='space-y-2'>
				<h3 className='font-medium text-green-900 dark:text-green-100'>
					Check your email
				</h3>
				<p className='text-sm text-green-700 dark:text-green-300'>
					We've sent a magic link to{' '}
					<span className='font-medium'>{email}</span>
				</p>
				<p className='text-xs text-green-600 dark:text-green-400'>
					Click the link in the email to sign in. You can close this tab.
				</p>
			</div>
			<Button
				onClick={onReset}
				variant='outline'
				size='sm'
				className='mt-4 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900'
			>
				<RefreshCw className='w-4 h-4 mr-2' />
				Try different email
			</Button>
		</CardContent>
	</Card>
);

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
			await auth.api.signInMagicLink({
				body: {
					email: data.email,
					callbackURL: redirectUrl,
				},
				headers: {
					'Content-Type': 'application/json',
				},
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
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className={className}
		>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						placeholder='Enter your email'
						{...form.register('email')}
						className={
							form.formState.errors.email
								? 'border-red-500 focus:border-red-500'
								: ''
						}
					/>
					{form.formState.errors.email && (
						<p className='text-sm text-red-500'>
							{form.formState.errors.email.message}
						</p>
					)}
				</div>
				<Button
					type='submit'
					className='w-full'
					loading={isLoading}
					loadingText='Sending link...'
				>
					<Mail className='w-4 h-4 mr-2' />
					Send Magic Link
				</Button>
			</div>
		</form>
	);
}
