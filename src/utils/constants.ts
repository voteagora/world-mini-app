import type { ProposalData } from "./types";

export const proposals: ProposalData[] = [
	{
		id: "proposal-13",
		type: "standard",
		status: "active",
		title: "Upgrade Proposal #13: OPCM and Incident Response improvements",
		description:
			"This proposal outlines more robust incident response processes and technical improvements to contracts and their management This proposal outlines more robust incident response processes and technical improvements to contracts and their management... This proposal outlines more robust incident response processes and technical improvements to contracts and their management...",
		endsIn: "28 days",
		options: ["For", "Against", "Abstain"],
		votes: {
			for: { amount: "57.88M", percentage: "97.80%" },
			against: { amount: "253.78K", percentage: "0.43%" },
			abstain: { amount: "1.00M", percentage: "2.00%" },
		},
        userVotes: [
            {
                name: "@angelina",
                support: "For",
            },
            {
                name: "@mira",
                support: "Against",
            },
            {
                name: "@messiah",
                support: "Abstain",
			},
		],
	},
	{
		id: "l1-pectra",
		type: "optimistic",
		status: "active",
		options: ["Against"],
		title: "Maintenance Upgrade: L1 Pectra Readiness",
		description:
			"This proposal outlines more robust incident response processes and technical improvements to contracts and their management...",
		endsIn: "28 days",
		blockThreshold: "12%",
		votes: {
			against: { amount: "757,507 OP", percentage: "0.7%" },
		},
        userVotes: [
            {
                name: "@angelina",
                support: "Against",
            },
            {
                name: "@mira",
                support: "Against",
            },
            {
                name: "@messiah",
                support: "Against",
            },
        ]
	},
	{
		id: "security-council-b",
		type: "approval",
		status: "active",
		options: ["L2beat", "Others"],
		title: "Security Council Elections Cohort B Members",
		description:
			"This proposal outlines more robust incident response processes and technical improvements to contracts and their management...",   
		endsIn: "28 days",
		votes: {
			L2beat: { amount: "52.41M", percentage: "83.56%" },
			Others: { amount: "224.05M", percentage: "36.44%" },
		},
		userVotes: [
			{
				name: "@angelina",
				support: "For",
				params: ["L2beat"],
			},
			{
				name: "@mira",
				support: "For",
				params: ["Others"],
			},
		],
	},
	{
		id: "season-7",
		type: "standard",
		status: "executed",
		options: ["For", "Against", "Abstain"],
		title: "Season 7: Chain Delegation Program Amendment",
		description:
			"This proposal outlines more robust incident response processes and technical improvements to contracts and their management...",
		votes: {
			for: { amount: "60.48M", percentage: "86.29%" },
			against: { amount: "10.28K", percentage: "0.02%" },
			abstain: { amount: "1.00M", percentage: "2.00%" },
		},
	},
];

export const delegate = {
	statement: `Laborum ea non enim qui est velit magna ad non. Cillum incididunt reprehenderit aute fugiat reprehenderit officia quis laboris officia proident. Lorem duis minim qui non. Esse incididunt laboris in sit ex ex proident laborum irure reprehenderit magna ut veniam. Quis id reprehenderit consequat mollit esse est eu. Minim veniam quis labore elit elit incididunt cillum exercitation ea et sint eu incididunt et. Ullamco cupidatat do et ad non amet eiusmod reprehenderit nisi consectetur incididunt sint nulla tempor.

Id ut amet duis cillum exercitation nostrud laborum nulla ipsum velit quis. Minim eiusmod ex cillum et in deserunt eiusmod elit culpa laborum. Nostrud magna id reprehenderit in quis ipsum.

Velit eiusmod irure excepteur duis exercitation non quis. Consectetur voluptate eu qui duis cillum sit mollit. Ut adipisicing eiusmod Lorem labore. Aliquip laboris esse pariatur amet ipsum tempor non occaecat reprehenderit.`,
	participation: [
		{
			proposalId: "proposal-13",
			proposalName: "Upgrade Proposal #13: OPCM and Incident Response improvements",
			support: "For",
		},
		{
			proposalId: "l1-pectra",
			proposalName: "Maintenance Upgrade: L1 Pectra Readiness",
			support: "Against",
		},
		{
			proposalId: "security-council-b",
			proposalName: "Security Council Elections Cohort B Members",
			support: "For",
			params: ["L2beat", "Others"],
		},
		{
			proposalId: "season-7",
			proposalName: "Season 7: Chain Delegation Program Amendment",
			support: "For",
		},
		{
			proposalId: "l1-pectra",
			proposalName: "Security Council Elections Cohort B Members",
			support: "Against",
		},
		{
			proposalId: "l1-pectra",
			proposalName: "Security Council Elections Cohort B Members",
			support: "Against",
		},
	],
};

