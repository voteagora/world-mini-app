import { ArrowLeftIcon } from "@/components/icons/ArrowLeft";
import { Page } from "@/components/PageLayout";
import { ParticipationItem } from "@/components/ParticipationItem";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import { getVotesForDelegateFromDaoNode } from "@/lib/dao-node/client";
import { Marble, TopBar, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ delegateAddress: string }>;
}) {
  const { delegateAddress } = await params;
  const isAddress = delegateAddress.startsWith("0x");
  const user = isAddress
    ? await MiniKit.getUserByAddress(delegateAddress)
    : await MiniKit.getUserByUsername(delegateAddress);
  const delegate = await getVotesForDelegateFromDaoNode(
    isAddress ? delegateAddress : user?.walletAddress
  );
  const votes = delegate?.voter_history;

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="Profile"
          startAdornment={
            <Link href="/proposals">
              <div className="flex items-center justify-center rounded-full p-2 bg-gray-200 w-10 h-10">
                <ArrowLeftIcon className="text-gray-900" />
              </div>
            </Link>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-16">
        <Marble
          src={
            user?.profilePictureUrl ??
            "https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
          }
          className="w-24"
        />
        <Typography
          variant="heading"
          level={3}
          color="default"
          className="text-gray-900 font-semibold mb-4"
        >
          {user?.username}
        </Typography>
        <div className="mt-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <Typography
              variant="subtitle"
              level={3}
              color="default"
              className="text-gray-400"
            >
              Votes
            </Typography>
            {(votes?.length ?? 0) > 5 && (
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
                  votes?.map((vote, index: number) => (
                    <ParticipationItem
                      key={vote.proposalId}
                      proposalName={vote.proposalName}
                      support={vote.support}
                      params={vote.params}
                      proposalId={vote.proposalId}
                      date={vote.date}
                      percentage={vote.percentage}
                      isFirst={index === 0}
                    />
                  )) ?? []
                }
                emptyMessage="No votes yet"
              />
            )}
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {votes?.length ? (
              votes
                .slice(0, 5)
                .map((vote, index: number) => (
                  <ParticipationItem
                    key={vote.proposalId}
                    proposalName={vote.proposalName}
                    support={vote.support}
                    params={vote.params}
                    proposalId={vote.proposalId}
                    date={vote.date}
                    percentage={vote.percentage}
                    isFirst={index === 0}
                  />
                ))
            ) : (
              <div className="flex items-center justify-center w-full">
                <Typography
                  variant="subtitle"
                  level={3}
                  color="default"
                  className="text-red-500"
                >
                  No votes yet
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Page.Main>
    </>
  );
}
