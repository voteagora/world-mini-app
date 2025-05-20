import { EmptyComponent } from "@/components/EmptyComponent";
import { Page } from "@/components/PageLayout";
import { ParticipationItem } from "@/components/ParticipationItem";
import { ProposalList } from "@/components/ProposalList";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import { delegate } from "@/utils/constants";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { Clock, ClockSolid } from "iconoir-react";

export default async function Proposals() {
  const votes = delegate.participation;
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
              items={votes.map((vote, index) => (
                <ParticipationItem
                  key={vote.proposalId}
                  proposalId={vote.proposalId}
                  proposalName={vote.proposalName}
                  support={vote.support}
                  date={vote.date}
                  params={vote.params}
                  isFirst={index === 0}
                />
              ))}
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
        <ProposalList />
      </Page.Main>
    </>
  );
}
