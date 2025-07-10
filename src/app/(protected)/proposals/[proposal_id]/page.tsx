import { Page } from "@/components/PageLayout";
import {
  Typography,
  Progress,
  TopBar,
  Button,
} from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircleSolid } from "iconoir-react";
import Link from "next/link";
import { TruncatedText } from "@/components/TruncatedText";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import { UserVoteItem } from "@/components/UserVoteItem";
import { notFound } from "next/navigation";
import { VoteDrawerContentWrapper } from "@/components/VoteDrawerContent";
import { ArrowLeftIcon } from "@/components/icons/ArrowLeft";
import {
  getProposalFromDaoNode,
  getVotesForDelegateFromDaoNode,
} from "@/lib/dao-node/client";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ proposal_id: string }>;
}) {
  const { proposal_id } = await params;
  const proposal = await getProposalFromDaoNode(proposal_id);
  const session = await auth();
  const delegate = await getVotesForDelegateFromDaoNode(
    session?.user.walletAddress
  );
  if (!proposal) {
    notFound();
  }
  const proposalStatus = proposal.status;
  const proposalType = proposal.type;

  const revalidate = async () => {
    "use server";
    revalidateTag("proposals");
  };

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          startAdornment={
            <Link href="/proposals">
              <div className="flex items-center justify-center rounded-full p-2 bg-gray-200 w-10 h-10">
                <ArrowLeftIcon className="text-gray-900" />
              </div>
            </Link>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-42 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-gray-500">
            <Typography variant="body" level={3} color="default">
              {proposalType.charAt(0).toUpperCase() + proposalType.slice(1)}{" "}
              Proposal
            </Typography>
            {proposalStatus === "active" && !!proposal.endsIn && (
              <>
                <span className="text-xs">·</span>
                <Typography variant="body" level={3} color="default">
                  Ends in {proposal.endsIn}
                </Typography>
              </>
            )}
            {proposalStatus === "executed" && (
              <>
                <span className="text-xs text-green-600">
                  <CheckCircleSolid className="w-4 h-4" />
                </span>
                <Typography variant="body" level={3} color="default">
                  Executed
                </Typography>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Typography variant="heading" level={2} color="default">
            {proposal.title}
          </Typography>
          <TruncatedText text={proposal.description} />
        </div>

        <div className="mt-4 w-full">
          <Typography
            variant="subtitle"
            level={2}
            color="default"
            className="text-gray-900 font-medium"
          >
            Voting activity
          </Typography>
          {proposalType === "standard" && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <Typography variant="subtitle" level={3} color="default">
                  For
                </Typography>
                <Progress
                  value={Number.parseFloat(
                    proposal.votes.for?.percentage ?? "0"
                  )}
                  max={100}
                  className="h-1.5 text-green-600 bg-gray-50"
                />
                <div className="flex justify-between">
                  <Typography
                    variant="body"
                    level={3}
                    color="default"
                    className="text-gray-500"
                  >
                    {proposal.votes.for?.amount ?? "0"}
                  </Typography>
                  <Typography
                    variant="subtitle"
                    level={3}
                    color="default"
                    className="text-gray-900 font-medium"
                  >
                    {proposal.votes.for?.percentage ?? "0%"}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="subtitle" level={3} color="default">
                  Abstain
                </Typography>
                <Progress
                  value={Number.parseFloat(
                    proposal.votes.abstain?.percentage ?? "0"
                  )}
                  max={100}
                  className="h-1.5 text-gray-900 bg-gray-50"
                />
                <div className="flex justify-between">
                  <Typography
                    variant="body"
                    level={3}
                    color="default"
                    className="text-gray-500"
                  >
                    {proposal.votes.abstain?.amount ?? "0"}
                  </Typography>
                  <Typography
                    variant="subtitle"
                    level={3}
                    color="default"
                    className="text-gray-900 font-medium"
                  >
                    {proposal.votes.abstain?.percentage ?? "0%"}
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Typography variant="subtitle" level={3} color="default">
                  Against
                </Typography>
                <Progress
                  value={Number.parseFloat(
                    proposal.votes.against?.percentage ?? "0"
                  )}
                  max={100}
                  className="h-1.5 text-red-600 bg-gray-50"
                />
                <div className="flex justify-between">
                  <Typography
                    variant="body"
                    level={3}
                    color="default"
                    className="text-gray-500"
                  >
                    {proposal.votes.against?.amount ?? "0"}
                  </Typography>
                  <Typography
                    variant="subtitle"
                    level={3}
                    color="default"
                    className="text-gray-900 font-medium"
                  >
                    {proposal.votes.against?.percentage ?? "0%"}
                  </Typography>
                </div>
              </div>
            </div>
          )}
          {proposalType === "approval" && (
            <div className="flex flex-col gap-4 mt-4">
              {Object.entries(proposal.votes).map(([key, value]) => {
                const voteData = value as {
                  amount: string;
                  percentage: string;
                };
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <Typography variant="subtitle" level={3} color="default">
                      {key}
                    </Typography>
                    <Progress
                      value={Number.parseFloat(voteData.percentage ?? "0")}
                      max={100}
                      className="h-1.5 text-green-600 bg-gray-50"
                    />
                    <div className="flex justify-between">
                      <Typography
                        variant="body"
                        level={3}
                        color="default"
                        className="text-gray-500"
                      >
                        {voteData.amount}
                      </Typography>
                      <Typography
                        variant="subtitle"
                        level={3}
                        color="default"
                        className="text-gray-900 font-medium"
                      >
                        {voteData.percentage}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <Typography
              variant="subtitle"
              level={2}
              color="default"
              className="text-gray-900"
            >
              Votes
            </Typography>
            {(proposal.userVotes?.length ?? 0) > 3 && (
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
                  proposal.userVotes?.map((user) => (
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
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {proposal.userVotes?.length ? (
              proposal.userVotes
                .slice(0, 3)
                .map((user) => (
                  <UserVoteItem
                    key={user.address}
                    address={user.address}
                    support={user.support}
                    params={user.params}
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
          </div>
        </div>
      </Page.Main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mb-8 mt-0 z-10">
        {proposal.status === "active" ? (
          <div className="flex flex-col gap-4">
            <Typography
              variant="subtitle"
              level={3}
              style={{ lineHeight: "1.5" }}
              className="text-center text-gray-500"
            >
              By voting, you agree with{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="text-gray-900"
                style={{ textDecoration: "underline" }}
                href="https://world.org/legal/user-terms-and-conditions"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                rel="noreferrer"
                className="text-gray-900"
                style={{ textDecoration: "underline" }}
                href="https://world.org/legal/privacy-notice"
              >
                Terms of Services
              </a>
            </Typography>
            <VoteDrawerContentWrapper
              proposal={proposal}
              hasVoted={delegate?.voter_history?.some(
                (vote) => vote.proposalId === proposal_id
              )}
              walletAddress={session?.user.walletAddress ?? ""}
              revalidate={revalidate}
            />
          </div>
        ) : (
          <Button className="w-full py-2" variant="primary" size="lg" disabled>
            Not open to voting
          </Button>
        )}
      </div>
    </>
  );
}
