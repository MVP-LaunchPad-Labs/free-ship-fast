'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api';

interface WaitlistSignupProps {
	extraStyle?: string;
}

interface FormData {
	email: string;
}

/**
 * Waitlist signup component using shadcn/ui components
 *
 * Features:
 * - Email collection for waitlist/lead generation
 * - Form validation and loading states
 * - Success feedback with toast notifications
 * - Shadcn/ui Button and Input components
 * - Tailwind variable colors for consistent theming
 * - Accessible form with proper labels
 */
const WaitlistSignup = ({ extraStyle }: WaitlistSignupProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const form = useForm<FormData>({
		defaultValues: {
			email: '',
		},
	});

	const handleSubmit = async (data: FormData) => {
		if (!data.email.trim()) {
			toast.error('Please enter a valid email address');
			return;
		}

		setIsLoading(true);
		try {
			await apiClient.post('/waitlist', { email: data.email });

			toast.success('Thanks for joining the waitlist!');

			// Clear form and disable for success state
			inputRef.current?.blur();
			form.reset();
			setIsDisabled(true);
		} catch (error) {
			console.error('Waitlist submission error:', error);
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				className={`w-full max-w-xs space-y-3 ${extraStyle || ''}`}
				onSubmit={form.handleSubmit(handleSubmit)}
				data-slot='waitlist-form'
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field, fieldState }) => (
						<FormItem className='space-y-2'>
							<FormLabel className='text-sm font-medium text-foreground'>
								Email address
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									ref={inputRef}
									type='email'
									placeholder='tom@cruise.com'
									autoComplete='email'
									required
									disabled={isDisabled || isLoading}
									className='bg-background border-border text-foreground placeholder:text-muted-foreground'
									aria-invalid={fieldState.invalid}
									aria-describedby={
										fieldState.error ? 'email-error' : undefined
									}
								/>
							</FormControl>
							{fieldState.error && (
								<p
									id='email-error'
									className='text-sm text-destructive'
									role='alert'
								>
									{fieldState.error.message}
								</p>
							)}
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isDisabled || isLoading}
					className='w-full gap-2'
					data-slot='waitlist-submit-button'
				>
					{isLoading ? (
						<>
							<Loader2 className='size-4 animate-spin' />
							Joining...
						</>
					) : (
						<>
							Join waitlist
							<ArrowRight className='size-4' />
						</>
					)}
				</Button>

				{isDisabled && (
					<p className='text-sm text-chart-4 text-center'>
						✓ You're on the list!
					</p>
				)}
			</form>
		</Form>
	);
};

export default WaitlistSignup;
