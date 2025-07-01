"use server";

import {
  FormattedVoterHistoryResponse,
  Proposal,
  ProposalData,
  ProposalsResponse,
  VoteRecordResponse,
  VoterHistoryResponse,
} from "@/utils/types";
import { unstable_cache } from "next/cache";
import {
  calculatePercentages,
  formatVoteHistoryItem,
  getDescriptionFromProposalDescriptionWithoutTitle,
  getProposalStatus,
  getTitleFromProposalDescription,
} from "../utils";
import { createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";

const url = process.env.DAONODE_URL;

const transformProposalToProposalData = async (
  proposal: Proposal
): Promise<ProposalData> => {
  const client = createPublicClient({
    chain: worldchain,
    transport: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  });
  const currentBlock = await client.getBlockNumber();

  const proposalType =
    proposal.voting_module_name === "approval" ? "approval" : "standard";

  const allVotes = calculatePercentages(proposal.totals);
  const votes: { [key: string]: { amount: string; percentage: string } } = {};

  if (proposalType === "standard") {
    votes.for = allVotes["1"] || { amount: "0", percentage: "0%" };
    votes.against = allVotes["0"] || { amount: "0", percentage: "0%" };
    votes.abstain = allVotes["2"] || { amount: "0", percentage: "0%" };
  } else if (proposalType === "approval") {
    const options = proposal.decoded_proposal_data[0]?.map((option: string) => [
      option?.replace(/^\[|\]$/g, ""),
    ]);

    Object.entries(allVotes).forEach(([key, value]) => {
      if (isNaN(parseInt(key))) {
        votes[key] = value;
      }
    });

    options.forEach((option: string) => {
      if (!votes[option]) {
        votes[option] = { amount: "0", percentage: "0%" };
      }
    });
  }

  const voteRecord = await getVotesForProposalFromDaoNode(proposal.id);
  const userVotes = voteRecord.vote_record.map((vote) => {
    const support: "For" | "Against" | "Abstain" =
      vote.support === 1 ? "For" : vote.support === 0 ? "Against" : "Abstain";

    let params: string[] | undefined;
    if (proposalType === "approval" && vote.params) {
      const optionKeys = Object.keys(allVotes).filter((key) =>
        isNaN(parseInt(key))
      );
      params = vote.params.map((paramIndex: number) => {
        return optionKeys[paramIndex] || `Option ${paramIndex}`;
      });
    }

    return {
      address: vote.voter,
      support,
      reason: vote.reason,
      params,
    };
  });

  const options =
    proposalType === "approval"
      ? proposal.decoded_proposal_data[0]?.map((option: string) => [
          option?.replace(/^\[|\]$/g, ""),
        ])
      : [];

  const settings =
    proposalType === "approval" ? proposal.decoded_proposal_data[1] : null;
  const maxApprovals = settings?.[1] || 1;

  const description = getDescriptionFromProposalDescriptionWithoutTitle(
    proposal.description
  );

  return {
    id: proposal.id,
    type: proposalType,
    status: getProposalStatus(proposal, currentBlock),
    title: getTitleFromProposalDescription(proposal.description),
    description,
    votes,
    options,
    userVotes,
    totals: proposal.totals,
    maxApprovals: proposalType === "approval" ? maxApprovals : 1,
  };
};

export const getAllProposalsFromDaoNode = unstable_cache(
  async (): Promise<ProposalData[]> => {
    try {
      const response = await fetch(`${url}v1/proposals?set=everything`);

      if (!response.ok) {
        throw new Error(
          `API responded with status: ${response.status} (${url})`
        );
      }

      const data = (await response.json()) as ProposalsResponse;

      const proposalsArray = Array.isArray(data.proposals)
        ? data.proposals
        : [];

      const filteredProposalsArray = proposalsArray.filter(
        (proposal) =>
          !!proposal.voting_module_name ||
          proposal.id ===
            "76394038729446378076763209086794491312770403404155383292113458071493948105440"
      );

      const sortedProposalsArray = filteredProposalsArray.sort((a, b) => {
        return b.vote_start - a.vote_start;
      });

      const parsedProposals = await Promise.all(
        sortedProposalsArray.map(transformProposalToProposalData)
      );

      const filteredProposals = parsedProposals.filter(
        (proposal) => proposal.status !== "canceled"
      );

      return filteredProposals;
    } catch (error) {
      console.error("Failed to fetch from DAO Node API:", error);
      throw error;
    }
  },
  ["proposals"],
  {
    revalidate: 60,
  }
);

export const getProposalFromDaoNode = async (
  proposalId: string
): Promise<ProposalData | null> => {
  try {
    const proposals = await getAllProposalsFromDaoNode();
    const proposal = proposals.find((p) => p.id === proposalId);

    if (!proposal) {
      return null;
    }

    return proposal;
  } catch (error) {
    console.error("Failed to get proposal from cached data:", error);
    return null;
  }
};

export const getVotesForDelegateFromDaoNode = async (
  address?: string
): Promise<FormattedVoterHistoryResponse | null> => {
  if (!address) {
    return null;
  }

  const client = createPublicClient({
    chain: worldchain,
    transport: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    ),
  });
  const currentBlock = await client.getBlockNumber();

  const response = await fetch(`${url}v1/voter_history/${address}`);
  const data = (await response.json()) as VoterHistoryResponse;

  const allProposals = await getAllProposalsFromDaoNode();

  const formattedVotes = data.voter_history.map((vote) => {
    const proposal = allProposals.find((p) => p.id === vote.proposal_id);
    return formatVoteHistoryItem(vote, proposal, currentBlock);
  });

  return {
    voter_history: formattedVotes,
  };
};

export const getVotesForProposalFromDaoNode = async (
  proposalId: string
): Promise<VoteRecordResponse> => {
  const response = await fetch(`${url}v1/vote_record/${proposalId}`);
  const data = await response.json();
  return data;
};
