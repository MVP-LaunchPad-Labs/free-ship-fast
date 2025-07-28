import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const hasEnvVars =
	process.env.MONGODB_URI &&
	process.env.MONGODB_DATABASE &&
	process.env.BETTER_AUTH_SECRET;
