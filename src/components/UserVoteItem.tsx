import { Marble, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { twMerge } from "tailwind-merge";

interface UserVoteItemProps {
	name: string;
	support: string;
	params?: string[];
	proposalType: string;
}

export function UserVoteItem({
	name,
	support,
	params,
	proposalType,
}: UserVoteItemProps) {
	return (
		<div className="flex items-center gap-2">
			<Marble
				className="w-12 h-12 rounded-full flex-shrink-0"
				src="https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
			/>
			<div className="flex flex-col flex-1">
				<Typography
					variant="subtitle"
					level={3}
					color="default"
					className="text-gray-900 font-medium"
				>
					{name}
				</Typography>
			</div>
			<Typography
				variant="subtitle"
				level={3}
				color="default"
				className={twMerge(
					"text-sm font-medium",
					support === "For"
						? "text-green-600"
						: support === "Against"
							? "text-gray-900"
							: "text-gray-400",
				)}
			>
				{proposalType === "approval" ? params?.join(", ") : support}
			</Typography>
		</div>
	);
}
