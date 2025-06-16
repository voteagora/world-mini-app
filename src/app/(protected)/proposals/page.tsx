import { auth } from "@/auth";
import { EmptyComponent } from "@/components/EmptyComponent";
import { Page } from "@/components/PageLayout";
import { ParticipationItem } from "@/components/ParticipationItem";
import { ProposalList } from "@/components/ProposalList";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import {
  getAllProposalsFromDaoNode,
  getVotesForDelegateFromDaoNode,
} from "@/lib/dao-node/client";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { Clock, ClockSolid } from "iconoir-react";

export default async function Proposals() {
  const proposals = await getAllProposalsFromDaoNode();
  const session = await auth();
  const delegate = await getVotesForDelegateFromDaoNode(
    session?.user.walletAddress
  );
  const votes = delegate?.voter_history;

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Proposals"
          endAdornment={
            <SeeAllDrawer
              trigger={
                <div className="flex items-center justify-center bg-gray-200 h-10 w-10 rounded-full">
                  <Clock className="text-gray-900" strokeWidth={2} />
                </div>
              }
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
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-16 px-4">
        <ProposalList proposals={proposals} />
      </Page.Main>
    </>
  );
}
