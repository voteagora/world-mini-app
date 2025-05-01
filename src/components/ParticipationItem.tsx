import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { NavArrowRight } from "iconoir-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface ParticipationItemProps {
	proposalName: string;
	proposalId: string;
	support: string;
	params?: string[];
}

export function ParticipationItem({
	proposalName,
	proposalId,
	support,
	params,
}: ParticipationItemProps) {
	return (
		<Link
			href={`/proposals/${proposalId}`}
			className="flex items-center justify-between gap-4"
		>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col flex-1">
					<Typography
						variant="subtitle"
						level={1}
						color="default"
						className="text-gray-900 font-medium"
					>
						{proposalName}
					</Typography>
				</div>
				<div className="flex items-center gap-2">
					<Typography variant="subtitle" level={3} className="text-gray-400">
						Voted
					</Typography>
					<div className="flex items-center gap-1">
						<div
							className={twMerge(
								"w-2 h-2 rounded-full",
								support === "For"
									? "bg-green-600"
									: support === "Against"
										? "bg-red-600"
										: "bg-gray-900",
							)}
						/>
						<Typography
							variant="subtitle"
							level={3}
							className={"font-medium text-gray-900"}
						>
							{params?.length ? params.join(", ") : support}
						</Typography>
					</div>
				</div>
			</div>
			<NavArrowRight className="text-gray-400 shrink-0" />
		</Link>
	);
}
