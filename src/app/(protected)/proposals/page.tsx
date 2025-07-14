import { auth } from "@/auth";
import { Page } from "@/components/PageLayout";
import { PastVotes } from "@/components/PastVotes";
import { ProposalList } from "@/components/ProposalList";
import { getAllProposalsFromDaoNode } from "@/lib/dao-node/client";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

export default async function Proposals() {
  const proposals = await getAllProposalsFromDaoNode();
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Proposals"
          endAdornment={
            <PastVotes walletAddress={session?.user.walletAddress} />
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-16 px-4">
        <ProposalList proposals={proposals} />
      </Page.Main>
    </>
  );
}
