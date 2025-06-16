/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProposalData {
  id: string;
  type: "standard" | "approval";
  status: "active" | "succeeded" | "failed" | "executed" | "pending";
  title: string;
  description: string;
  endsIn?: string;
  votes: {
    [key: string]: { amount: string; percentage: string };
  };
  options: string[];
  userVotes?: {
    address: string;
    support: "For" | "Against" | "Abstain";
    reason?: string;
    params?: string[];
  }[];
  totals: VoteTotals;
  maxApprovals?: number;
}

export interface VoteTotals {
  "no-param": {
    "0": string;
    "1": string;
    "2": string;
  };
  [key: string]:
    | string
    | {
        "0": string;
        "1": string;
        "2": string;
      };
}

export interface ProposalType {
  quorum: number;
  approval_threshold: number;
  name: string;
  module: string | null;
  scopes: string[];
  id: number;
}

export interface Proposal {
  block_number: string;
  transaction_index: number;
  log_index: number;
  proposer: string;
  targets: string[];
  values: number[];
  signatures: string[];
  calldatas: string[];
  vote_start: number;
  vote_end: number;
  description: string;
  proposal_type: number;
  id: string;
  voting_module_name: string;
  totals: VoteTotals;
  decoded_proposal_data: any[];
}

export interface VoteHistoryItem {
  voter: string;
  proposal_id: string;
  support: number;
  weight: number;
  bn: string;
  tid: number;
  lid: number;
  proposal_type: ProposalType;
  params?: number[];
}

export interface VoterHistoryResponse {
  voter_history: VoteHistoryItem[];
}

export interface FormattedVoteHistoryItem {
  proposalId: string;
  proposalName: string;
  support: string;
  params: string[];
  date: string;
  percentage: string;
}

export interface FormattedVoterHistoryResponse {
  voter_history: FormattedVoteHistoryItem[];
}

export interface VoteRecordItem {
  voter: string;
  support: number;
  weight: number;
  bn: string;
  tid: number;
  lid: number;
  reason?: string;
  params?: number[];
}

export interface VoteRecordResponse {
  vote_record: VoteRecordItem[];
  has_more: boolean;
  proposal_type: ProposalType;
}

export interface ProposalsResponse {
  proposals: Proposal[];
}
