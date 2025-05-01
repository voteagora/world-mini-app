import { proposals } from "@/utils/constants";
import type { ProposalData } from "@/utils/types";
import {
	Typography,
	Progress,
	CircularIcon,
} from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircleSolid, FlashSolid } from "iconoir-react";
import Link from "next/link";

const ProposalCard = ({ proposal }: { proposal: ProposalData }) => {
	const proposalType =
		proposal.type === "standard"
			? "Standard"
			: proposal.type === "optimistic"
				? "Optimistic"
				: "Approval";
	const proposalStatus =
		proposal.status === "active"
			? "Active"
			: proposal.status === "executed"
				? "Executed"
				: "Past";
	return (
		<Link
			href={`/proposals/${proposal.id}`}
			className="w-full p-4 bg-gray-50 rounded-xl shadow-sm"
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-1 font-medium text-gray-500">
					<Typography variant="subtitle" level={4}>
						{proposalType} Proposal
					</Typography>
					{proposalStatus === "Active" && !!proposal.endsIn && (
						<>
							<span className="text-xs text-blue-600">
								<FlashSolid className="w-4 h-4" />
							</span>
							<Typography variant="subtitle" level={4} color="default">
								Ends in {proposal.endsIn}
							</Typography>
						</>
					)}
					{proposalStatus === "Executed" && (
						<>
							<span className="text-xs text-green-600">
								<CheckCircleSolid className="w-4 h-4" />
							</span>
							<Typography variant="subtitle" level={4} color="default">
								Executed
							</Typography>
						</>
					)}
				</div>

				<Typography variant="subtitle" className="font-semibold">
					{proposal.title}
				</Typography>

				<div className="flex flex-col gap-3">
					{proposalType === "Standard" && (
						<>
							<Progress
								value={Number.parseFloat(proposal.votes.for?.percentage ?? "0")}
								max={100}
								className="h-1.5 text-green-600 bg-gray-900"
							/>
							{proposal.votes.for && (
								<div className="flex justify-between text-sm">
									<div className="flex items-center gap-2">
										<CircularIcon className="size-2 bg-green-600" />
										<Typography variant="body" level={3}>
											For
										</Typography>
									</div>
									<Typography variant="subtitle" level={3}>
										{proposal.votes.for.amount}{" "}
										<span className="text-gray-500">
											({proposal.votes.for.percentage})
										</span>
									</Typography>
								</div>
							)}

							{proposal.votes.against && (
								<div className="flex justify-between text-sm">
									<div className="flex items-center gap-2">
										<CircularIcon className="size-2 bg-gray-900" />
										<Typography variant="body" level={3}>
											Against
										</Typography>
									</div>
									<Typography variant="subtitle" level={3}>
										{proposal.votes.against.amount}{" "}
										<span className="text-gray-500">
											({proposal.votes.against.percentage})
										</span>
									</Typography>
								</div>
							)}
						</>
					)}

					{proposalType === "Optimistic" && (
						<div>
							<Progress
								value={Number.parseFloat(
									proposal.votes.against?.percentage ?? "0",
								)}
								max={100}
								className="h-1.5 text-green-600 bg-gray-900"
							/>
							{proposal.votes.against && (
								<div className="flex flex-col gap-3 mt-3">
									<div className="flex justify-between text-sm">
										<div className="flex items-center gap-2">
											<CircularIcon className="size-2 bg-green-600" />
											<Typography variant="body" level={3}>
												Opposition
											</Typography>
										</div>
										<Typography variant="subtitle" level={3}>
											{proposal.votes.against.amount}{" "}
											<span className="text-gray-500">
												({proposal.votes.against.percentage})
											</span>
										</Typography>
									</div>
									<div className="flex justify-between text-sm">
										<div className="flex items-center gap-2">
											<CircularIcon className="size-2 bg-gray-900" />
											<Typography variant="body" level={3}>
												Block Threshold
											</Typography>
										</div>
										<Typography variant="subtitle" level={3}>
											{proposal.blockThreshold}
										</Typography>
									</div>
								</div>
							)}
						</div>
					)}

					{proposalType === "Approval" && (
						<div>
							<Progress
								value={Number.parseFloat(
									proposal.votes.L2beat?.percentage ?? "0",
								)}
								max={100}
								className="h-1.5 text-green-600 bg-gray-900"
							/>
							{proposal.votes.L2beat && (
								<div className="flex flex-col gap-3 mt-3">
									<div className="flex justify-between text-sm">
										<div className="flex items-center gap-2">
											<CircularIcon className="size-2 bg-green-600" />
											<Typography variant="body" level={3}>
												L2BEAT
											</Typography>
										</div>
										<Typography variant="subtitle" level={3}>
											{proposal.votes.L2beat.amount}{" "}
											<span className="text-gray-500">
												({proposal.votes.L2beat.percentage})
											</span>
										</Typography>
									</div>
									<div className="flex justify-between text-sm">
										<div className="flex items-center gap-2">
											<CircularIcon className="size-2 bg-gray-900" />
											<Typography variant="body" level={3}>
												Others
											</Typography>
										</div>
										<Typography variant="subtitle" level={3}>
											{proposal.votes.Others?.amount}
										</Typography>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

export const ProposalList = () => {
	const activeProposals = proposals.filter((p) => p.status === "active");
	const pastProposals = proposals.filter(
		(p) => p.status === "past" || p.status === "executed",
	);

	return (
		<div className="w-full flex flex-col gap-6 px-2">
			<section>
				<Typography
					variant="label"
					color="default"
					className="text-gray-400 font-medium"
				>
					Active Proposal · {activeProposals.length}
				</Typography>
				<div className="flex flex-col gap-3 mt-3">
					{activeProposals.map((proposal) => (
						<ProposalCard key={proposal.id} proposal={proposal} />
					))}
				</div>
			</section>

			<section>
				<Typography
					variant="label"
					color="default"
					className="text-gray-400 font-medium"
				>
					Past Proposals · {pastProposals.length}
				</Typography>
				<div className="flex flex-col gap-3 mt-3">
					{pastProposals.map((proposal) => (
						<ProposalCard key={proposal.id} proposal={proposal} />
					))}
				</div>
			</section>
		</div>
	);
};
