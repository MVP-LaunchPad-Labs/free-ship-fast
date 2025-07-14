'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradientButtonProps {
	title?: string;
	onClick?: () => void;
	className?: string;
}

/**
 * Gradient button component with shadcn/ui styling
 *
 * Features:
 * - Custom gradient background with shimmer animation
 * - Built on shadcn Button component
 * - Accessible and customizable
 * - Uses tailwind variable colors for consistency
 */
const GradientButton = ({
	title = 'Gradient Button',
	onClick = () => {},
	className,
}: GradientButtonProps) => {
	return (
		<Button
			onClick={onClick}
			className={cn(
				'bg-gradient-to-r from-primary via-primary/80 to-primary bg-size-200 animate-shimmer',
				'hover:bg-gradient-to-l hover:from-primary hover:via-primary/90 hover:to-primary',
				'text-primary-foreground shadow-lg',
				className
			)}
			data-slot='gradient-button'
		>
			{title}
		</Button>
	);
};

export default GradientButton;
