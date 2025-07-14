"use client";

import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { UserVoteItem } from "./UserVoteItem";
import { SeeAllDrawer } from "./SeeAllDrawer";
import { useProposalVotesStore, VoteItem } from "@/lib/stores/proposalVotes";
import { useEffect } from "react";

export const ProposalVotes = ({
  proposalId,
  votes: initialVotes,
  proposalType,
}: {
  proposalId: string;
  votes?: VoteItem[];
  proposalType: "standard" | "approval";
}) => {
  const { initializeVotes, getVotes } = useProposalVotesStore();

  useEffect(() => {
    if (initialVotes) {
      initializeVotes(proposalId, initialVotes);
    }
  }, [proposalId, initialVotes, initializeVotes]);

  const votes = getVotes(proposalId);

  return (
    <>
      {votes?.length ? (
        votes
          .slice(0, 3)
          .map((vote) => (
            <UserVoteItem
              key={vote.address}
              address={vote.address}
              support={vote.support}
              params={vote.params}
              proposalType={proposalType}
            />
          ))
      ) : (
        <div className="flex items-center justify-center w-full">
          <Typography
            variant="subtitle"
            level={3}
            color="default"
            className="text-gray-500 italic"
          >
            No user votes yet
          </Typography>
        </div>
      )}
    </>
  );
};

export const ProposalVotesDrawer = ({
  proposalId,
  votes: initialVotes,
  proposalType,
}: {
  proposalId: string;
  votes?: VoteItem[];
  proposalType: "standard" | "approval";
}) => {
  const { initializeVotes, getVotes } = useProposalVotesStore();

  useEffect(() => {
    if (initialVotes) {
      initializeVotes(proposalId, initialVotes);
    }
  }, [proposalId, initialVotes, initializeVotes]);

  const votes = getVotes(proposalId);

  return (
    <>
      {(votes?.length ?? 0) > 3 && (
        <SeeAllDrawer
          trigger={
            <button type="button">
              <Typography
                variant="subtitle"
                level={3}
                color="default"
                className="text-gray-400"
              >
                See all
              </Typography>
            </button>
          }
          title="Votes"
          items={
            votes?.map((user) => (
              <UserVoteItem
                key={user.address}
                address={user.address}
                support={user.support}
                params={user.params}
                proposalType={proposalType}
              />
            )) ?? []
          }
          emptyMessage="No user votes yet"
        />
      )}
    </>
  );
};
