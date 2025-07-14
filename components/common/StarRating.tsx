import { Star } from "lucide-react";

interface StarRatingProps {
	rating?: number;
	maxRating?: number;
	showText?: boolean;
	size?: "sm" | "md" | "lg";
}

/**
 * Star rating component with configurable rating display
 *
 * Features:
 * - Displays filled and empty stars based on rating
 * - Configurable maximum rating
 * - Optional text display
 * - Multiple size options
 */
const StarRating = ({
	rating = 5,
	maxRating = 5,
	showText = true,
	size = "md",
}: StarRatingProps) => {
	const sizeClasses = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	};

	return (
		<div className="flex items-center gap-4 mt-auto">
			<div className="text-6xl opacity-20 rotate-12 select-none">"</div>
			<div>
				{showText && (
					<p className="text-muted-foreground text-sm text-center">
						1000+ happy users
					</p>
				)}
				<div className="flex flex-row justify-center gap-0 pt-1">
					{[...Array(maxRating)].map((_, i) => (
						<Star
							key={i}
							className={`${sizeClasses[size]} ${
								i < rating
									? "fill-yellow-400 text-yellow-400"
									: "fill-gray-200 text-gray-200"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default StarRating;
