export interface ProposalData {
	id: string;
	type: "standard" | "optimistic" | "approval";
	status: "active" | "executed" | "past";
	title: string;
	description: string;
	endsIn?: string;
	blockThreshold?: string;
	votes: {
		[key: string]: { amount: string; percentage: string };
	};
	options: string[];
	userVotes?: {
		name: string;
		support: "For" | "Against" | "Abstain";
		reason?: string;
		params?: string[];
	}[];
}