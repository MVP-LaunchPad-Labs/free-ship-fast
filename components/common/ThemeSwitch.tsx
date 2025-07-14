"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
	variant?: "button" | "dropdown";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

/**
 * Theme switch component using shadcn/ui and next-themes
 *
 * Features:
 * - Switch between light, dark, and system themes
 * - Dropdown variant for multiple theme options
 * - Button variant for simple light/dark toggle
 * - Proper icons and animations
 * - Accessible with keyboard navigation
 * - Uses shadcn/ui components for consistent styling
 * - Tailwind variable colors throughout
 */
const ThemeSwitch = ({
	variant = "dropdown",
	size = "default",
	className,
}: ThemeSwitchProps) => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Avoid hydration mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size={size}
				className={cn("opacity-0", className)}
				disabled
			>
				<Sun className="size-4" />
			</Button>
		);
	}

	if (variant === "button") {
		// Simple toggle between light and dark
		const toggleTheme = () => {
			setTheme(theme === "dark" ? "light" : "dark");
		};

		return (
			<Button
				variant="ghost"
				size={size}
				onClick={toggleTheme}
				className={cn("transition-transform hover:scale-105", className)}
				title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
				data-slot="theme-toggle-button"
			>
				<Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	// Dropdown variant with all theme options
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size={size}
					className={cn("transition-transform hover:scale-105", className)}
					title="Toggle theme"
					data-slot="theme-toggle-dropdown"
				>
					<Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="bg-popover border-border shadow-md"
				data-slot="theme-dropdown-content"
			>
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className={cn(
						"gap-2 cursor-pointer",
						theme === "light" && "bg-accent text-accent-foreground",
					)}
				>
					<Sun className="size-4" />
					Light
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className={cn(
						"gap-2 cursor-pointer",
						theme === "dark" && "bg-accent text-accent-foreground",
					)}
				>
					<Moon className="size-4" />
					Dark
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className={cn(
						"gap-2 cursor-pointer",
						theme === "system" && "bg-accent text-accent-foreground",
					)}
				>
					<Monitor className="size-4" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ThemeSwitch;
