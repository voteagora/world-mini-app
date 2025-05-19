import { Page } from "@/components/PageLayout";
import { proposals } from "@/utils/constants";
import {
  Typography,
  Progress,
  TopBar,
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
} from "@worldcoin/mini-apps-ui-kit-react";
import { ArrowLeft, CheckCircleSolid } from "iconoir-react";
import Link from "next/link";
import { TruncatedText } from "@/components/TruncatedText";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import { UserVoteItem } from "@/components/UserVoteItem";
import { notFound } from "next/navigation";
import { VoteDrawerContent } from "@/components/VoteDrawerContent";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ proposal_id: string }>;
}) {
  const voteState = null;
  const { proposal_id } = await params;
  const proposal = proposals.find((proposal) => proposal.id === proposal_id);
  if (!proposal) {
    notFound();
  }
  const proposalStatus = proposal.status;
  const proposalType = proposal.type;

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          startAdornment={
            <Link href="/proposals">
              <div className="flex items-center justify-center rounded-full p-2 bg-gray-200 w-10 h-10">
                <ArrowLeft className="text-gray-900" />
              </div>
            </Link>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-16 px-4">
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
          {proposalType === "optimistic" && (
            <div className="flex flex-col gap-4 mt-4">
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
              {Object.entries(proposal.votes).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <Typography variant="subtitle" level={3} color="default">
                    {key}
                  </Typography>
                  <Progress
                    value={Number.parseFloat(value.percentage ?? "0")}
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
                      {value.amount}
                    </Typography>
                    <Typography
                      variant="subtitle"
                      level={3}
                      color="default"
                      className="text-gray-900 font-medium"
                    >
                      {value.percentage}
                    </Typography>
                  </div>
                </div>
              ))}
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
                      key={user.name}
                      name={user.name}
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
                    key={user.name}
                    name={user.name}
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
                  className="text-red-500"
                >
                  No user votes yet
                </Typography>
              </div>
            )}
          </div>
        </div>

        {proposal.status === "active" ? (
          <Drawer>
            <DrawerTrigger
              disabled={proposal.status !== "active" || voteState === "success"}
              asChild
            >
              <Button variant="primary" size="lg" className="w-full py-2 my-8">
                <div className="flex items-center py-4">
                  {voteState === "success" ? "You've already voted" : "Vote"}
                </div>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <Page.Header className="pb-0">
                <DrawerHeader />
              </Page.Header>
              <Page.Main className="flex flex-col justify-between pt-0 mb-4 h-[calc(100vh-100px)]">
                <VoteDrawerContent
                  proposal={proposal}
                  proposalType={proposalType}
                  initialVoteState={null}
                />
              </Page.Main>
            </DrawerContent>
          </Drawer>
        ) : (
          <Button className="w-full py-2" variant="primary" size="lg" disabled>
            Not open to voting
          </Button>
        )}
      </Page.Main>
    </>
  );
}
