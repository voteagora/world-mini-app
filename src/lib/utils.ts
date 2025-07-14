import {
  FormattedVoteHistoryItem,
  Proposal,
  ProposalData,
  ProposalType,
  VoteHistoryItem,
  VoteTotals,
} from "@/utils/types";

const removeBold = (text: string | null): string | null =>
  text ? text.replace(/\*\*/g, "") : text;

const removeItalics = (text: string | null): string | null =>
  text ? text.replace(/__/g, "") : text;

export const getTitleFromProposalDescription = (description: string = "") => {
  const normalizedDescription = description
    .replace(/\\n/g, "\n")
    .replace(/(^['"]|['"]$)/g, "");

  return (
    removeItalics(removeBold(extractTitle(normalizedDescription)))?.trim() ??
    "Untitled"
  );
};

export const getDescriptionFromProposalDescriptionWithoutTitle = (
  description: string = ""
) => {
  const normalizedDescription = description
    .replace(/\\n/g, "\n")
    .replace(/(^['"]|['"]$)/g, "");

  let descriptionWithoutTitle = normalizedDescription;

  const hashMatch = descriptionWithoutTitle.match(/^\s*#{1,6}\s+[^\n]+\n?/);
  if (hashMatch) {
    descriptionWithoutTitle = descriptionWithoutTitle.replace(hashMatch[0], "");
  } else {
    const underlineMatch = descriptionWithoutTitle.match(
      /^\s*[^\n]+\n(={3,25}|-{3,25})\n?/
    );
    if (underlineMatch) {
      descriptionWithoutTitle = descriptionWithoutTitle.replace(
        underlineMatch[0],
        ""
      );
    } else {
      const firstLineMatch = descriptionWithoutTitle.match(/^\s*([^\n]+)\n/);
      if (firstLineMatch) {
        descriptionWithoutTitle = descriptionWithoutTitle.replace(
          firstLineMatch[0],
          ""
        );
      }
    }
  }

  return descriptionWithoutTitle.split("#proposalTypeId")[0].trim();
};

const extractTitle = (body: string | undefined): string | null => {
  if (!body) return null;
  const hashResult = body.match(/^\s*#{1,6}\s+([^\n]+)/);
  if (hashResult) {
    return hashResult[1];
  }

  const equalResult = body.match(/^\s*([^\n]+)\n(={3,25}|-{3,25})/);
  if (equalResult) {
    return equalResult[1];
  }

  const textResult = body.match(/^\s*([^\n]+)\s*/);
  if (textResult) {
    return textResult[1];
  }

  return null;
};

export const calculatePercentages = (
  totals: VoteTotals
): { [key: string]: { amount: string; percentage: string } } => {
  const votes: { [key: string]: { amount: string; percentage: string } } = {};

  let totalVotes = 0;
  const voteAmounts: { [key: string]: number } = {};

  Object.entries(totals).forEach(([key, value]) => {
    if (key === "no-param") {
      Object.entries(value).forEach(([subKey, amount]) => {
        const numAmount = parseInt(amount as string) || 0;
        voteAmounts[subKey] = numAmount;
        totalVotes += numAmount;
      });
    } else {
      if (typeof value === "object" && value !== null) {
        let totalForOption = 0;
        Object.entries(value).forEach(([, amount]) => {
          const numAmount = parseInt(amount as string) || 0;
          totalForOption += numAmount;
        });
        voteAmounts[key] = totalForOption;
        totalVotes += totalForOption;
      } else {
        const numAmount = parseInt(value as string) || 0;
        voteAmounts[key] = numAmount;
        totalVotes += numAmount;
      }
    }
  });

  Object.entries(voteAmounts).forEach(([key, amount]) => {
    const percentage =
      totalVotes > 0 ? ((amount / totalVotes) * 100).toFixed(1) : "0.0";
    votes[key] = {
      amount: amount.toString(),
      percentage: `${percentage}%`,
    };
  });

  return votes;
};

export const formatVoteSupport = (
  support: number,
  params?: number[],
  optionKeys?: string[]
): { support: string; params: string[] } => {
  let formattedSupport: string;
  let formattedParams: string[] = [];

  if (params?.length) {
    formattedParams = params.map(
      (p: number) => optionKeys?.[p] || `Option ${p}`
    );
    formattedSupport = formattedParams.join(", ");
  } else {
    formattedSupport =
      support === 1 ? "For" : support === 0 ? "Against" : "Abstain";
  }

  return { support: formattedSupport, params: formattedParams };
};

export const getProposalStatus = (
  proposal: Proposal,
  currentBlock: bigint,
  proposalTypeInfo?: ProposalType
): "active" | "succeeded" | "failed" | "executed" | "pending" | "canceled" => {
  const minParticipation = proposal.decoded_proposal_data?.[1]?.[0];
  const votes = calculatePercentages(proposal.totals);
  const totalVotes = Object.values(votes).reduce(
    (sum, vote) => sum + Number(vote.amount),
    0
  );
  const hasMetMinParticipation = minParticipation
    ? totalVotes >= minParticipation
    : true;

  if (!!proposal.cancel_event) {
    return "canceled";
  }
  if (currentBlock < proposal.vote_start) {
    return "pending";
  } else if (currentBlock <= proposal.vote_end) {
    return "active";
  } else if (!hasMetMinParticipation) {
    return "failed";
  } else if (proposal.voting_module_name === "standard") {
    const forVotes = votes["1"]?.amount;
    const againstVotes = votes["0"]?.amount;
    const thresholdVotes = BigInt(forVotes) + BigInt(againstVotes);
    const voteThresholdPercent =
      Number(thresholdVotes) > 0
        ? (Number(forVotes) / Number(thresholdVotes)) * 100
        : 0;
    const apprThresholdPercent =
      Number(proposalTypeInfo?.approval_threshold || 0) / 100;
    const hasMetThreshold = Boolean(
      voteThresholdPercent >= apprThresholdPercent
    );
    if (!hasMetThreshold || forVotes < againstVotes) {
      return "failed";
    } else {
      return "succeeded";
    }
  } else {
    return "succeeded";
  }
};

export const formatVoteHistoryItem = (
  vote: VoteHistoryItem,
  proposal: ProposalData | undefined,
  currentBlock: bigint,
  options: string[]
): FormattedVoteHistoryItem => {
  const proposalName = proposal
    ? proposal.title || "Untitled Proposal"
    : `Proposal ${vote.proposal_id}`;

  const blockNumber = BigInt(vote.bn);
  const blockDiff = currentBlock - blockNumber;
  const secondsDiff = blockDiff * BigInt(2);
  const date = new Date(
    Date.now() - Number(secondsDiff) * 1000
  ).toLocaleDateString();

  let percentage = "0%";
  if (proposal) {
    const allVotes = calculatePercentages(proposal.totals);

    if (vote.params?.length) {
      const selectedPercentages = vote.params.map((paramIndex: number) => {
        return allVotes[paramIndex.toString()]
          ? parseFloat(allVotes[paramIndex.toString()].percentage || "0")
          : 0;
      });
      const totalPercentage = selectedPercentages.reduce(
        (sum, p) => sum + p,
        0
      );
      percentage = `${totalPercentage.toFixed(1)}%`;
    } else {
      const supportKey =
        vote.support === 1 ? "1" : vote.support === 0 ? "0" : "2";
      percentage = allVotes[supportKey]?.percentage || "0%";
    }
  }

  const { support, params } = formatVoteSupport(
    vote.support,
    vote.params,
    options
  );

  return {
    proposalId: vote.proposal_id,
    proposalName,
    support,
    params,
    date,
    percentage,
  };
};
