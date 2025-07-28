import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Check if required environment variables are set
export const hasEnvVars =
	process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET;
