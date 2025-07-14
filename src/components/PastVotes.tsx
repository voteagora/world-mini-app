"use client";

import { Clock, ClockSolid } from "iconoir-react";
import { EmptyComponent } from "./EmptyComponent";
import { ParticipationItem } from "./ParticipationItem";
import { useQuery } from "@tanstack/react-query";
import { getVotesForDelegateFromDaoNode } from "@/lib/dao-node/client";
import { SeeAllDrawer } from "./SeeAllDrawer";

export const PastVotes = ({ walletAddress }: { walletAddress?: string }) => {
  const { data: delegate, isLoading } = useQuery({
    queryKey: ["votes", walletAddress],
    queryFn: () => getVotesForDelegateFromDaoNode(walletAddress),
    enabled: !!walletAddress,
  });
  const votes = delegate?.voter_history;
  return (
    <SeeAllDrawer
      trigger={
        <div className="flex items-center justify-center bg-gray-200 h-10 w-10 rounded-full">
          <Clock className="text-gray-900" strokeWidth={2} />
        </div>
      }
      isLoading={isLoading}
      title="Votes"
      items={
        votes?.map((vote, index: number) => (
          <ParticipationItem
            key={vote.proposalId}
            proposalId={vote.proposalId}
            proposalName={vote.proposalName}
            support={vote.support}
            date={vote.date}
            params={vote.params}
            percentage={vote.percentage}
            isFirst={index === 0}
          />
        )) ?? []
      }
      emptyComponent={
        <EmptyComponent
          icon={<ClockSolid className="w-12 h-12 text-white" />}
          title="No votes yet"
          description="Your votes will be displayed here once available"
        />
      }
    />
  );
};
