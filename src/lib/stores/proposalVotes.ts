import { create } from "zustand";

export interface VoteItem {
  address: string;
  support: "For" | "Against" | "Abstain";
  reason?: string;
  params?: string[];
}

interface ProposalVotesState {
  votes: Record<string, VoteItem[]>;
  initializeVotes: (proposalId: string, initialVotes: VoteItem[]) => void;
  addVote: (proposalId: string, vote: VoteItem) => void;
  getVotes: (proposalId: string) => VoteItem[];
}

export const useProposalVotesStore = create<ProposalVotesState>((set, get) => ({
  votes: {},

  initializeVotes: (proposalId: string, initialVotes: VoteItem[]) => {
    set((state) => ({
      votes: {
        ...state.votes,
        [proposalId]: initialVotes,
      },
    }));
  },

  addVote: (proposalId: string, vote: VoteItem) => {
    set((state) => ({
      votes: {
        ...state.votes,
        [proposalId]: [vote, ...(state.votes[proposalId] || [])],
      },
    }));
  },

  getVotes: (proposalId: string) => {
    return get().votes[proposalId] || [];
  },
}));
