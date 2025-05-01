"use client";

import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TruncatedTextProps {
	text: string;
	maxLines?: number;
	className?: string;
}

export function TruncatedText({
	text,
	maxLines = 5,
	className,
}: TruncatedTextProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<Typography
				variant="body"
				level={2}
				color="default"
				className={twMerge(
					"text-gray-500",
					!isExpanded && `line-clamp-${maxLines}`,
					className,
				)}
			>
				{text}
			</Typography>
			{!isExpanded && (
				<button
					type="button"
					className="flex"
					onClick={() => setIsExpanded(true)}
				>
					<Typography
						variant="subtitle"
						level={3}
						color="default"
						className="text-gray-900 font-medium"
					>
						Read more
					</Typography>
				</button>
			)}
		</div>
	);
}
