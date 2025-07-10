import type { ProposalData } from "@/utils/types";
import {
  Typography,
  Progress,
  CircularIcon,
} from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircleSolid, Page } from "iconoir-react";
import Link from "next/link";
import { EmptyComponent } from "./EmptyComponent";

const ProposalCard = ({ proposal }: { proposal: ProposalData }) => {
  const proposalType = proposal.type === "standard" ? "Standard" : "Approval";
  const proposalStatus =
    proposal.status === "active"
      ? "Active"
      : proposal.status === "executed"
      ? "Executed"
      : "Past";

  const sortedOptions = proposal.options.sort((a, b) => {
    const aIndex = Number(proposal.votes[a]?.amount ?? 0);
    const bIndex = Number(proposal.votes[b]?.amount ?? 0);
    return bIndex - aIndex;
  });

  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="w-full p-4 bg-gray-50 rounded-xl shadow-sm"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 font-medium text-gray-500">
          <Typography variant="subtitle" level={4}>
            {proposalType} Proposal
          </Typography>
          {proposalStatus === "Active" && !!proposal.endsIn && (
            <>
              <span className="text-xs">·</span>
              <Typography variant="subtitle" level={4} color="default">
                Ends in {proposal.endsIn}
              </Typography>
            </>
          )}
          {proposalStatus === "Executed" && (
            <>
              <span className="text-xs text-green-600">
                <CheckCircleSolid className="w-4 h-4" />
              </span>
              <Typography variant="subtitle" level={4} color="default">
                Executed
              </Typography>
            </>
          )}
        </div>

        <Typography variant="subtitle" className="font-semibold">
          {proposal.title}
        </Typography>

        <div className="flex flex-col gap-3">
          {proposalType === "Standard" && (
            <>
              <Progress
                value={Number.parseFloat(proposal.votes.for?.percentage ?? "0")}
                max={100}
                className="h-1.5 text-green-600 bg-gray-900"
              />
              {proposal.votes.for && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CircularIcon className="size-2 bg-green-600" />
                    <Typography variant="body" level={3}>
                      For
                    </Typography>
                  </div>
                  <Typography variant="subtitle" level={3}>
                    {proposal.votes.for.amount}{" "}
                    <span className="text-gray-500">
                      ({proposal.votes.for.percentage})
                    </span>
                  </Typography>
                </div>
              )}

              {proposal.votes.against && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CircularIcon className="size-2 bg-gray-900" />
                    <Typography variant="body" level={3}>
                      Against
                    </Typography>
                  </div>
                  <Typography variant="subtitle" level={3}>
                    {proposal.votes.against.amount}{" "}
                    <span className="text-gray-500">
                      ({proposal.votes.against.percentage})
                    </span>
                  </Typography>
                </div>
              )}
            </>
          )}

          {proposalType === "Approval" && (
            <div>
              {proposal.options.length > 0 && (
                <>
                  <Progress
                    value={Number.parseFloat(
                      proposal.votes[proposal.options[0]]?.percentage ?? "0"
                    )}
                    max={100}
                    className="h-1.5 text-green-600 bg-gray-900"
                  />
                  <div className="flex flex-col gap-3 mt-3">
                    {sortedOptions.slice(0, 2).map((option, index) => (
                      <div
                        key={option}
                        className="flex justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <CircularIcon
                            className={`size-2 ${
                              index === 0 ? "bg-green-600" : "bg-gray-900"
                            }`}
                          />
                          <Typography variant="body" level={3}>
                            {option}
                          </Typography>
                        </div>
                        <Typography variant="subtitle" level={3}>
                          {proposal.votes[option]?.amount ?? "0"}{" "}
                          <span className="text-gray-500">
                            ({proposal.votes[option]?.percentage ?? "0%"})
                          </span>
                        </Typography>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProposalList = ({ proposals }: { proposals: ProposalData[] }) => {
  const activeProposals = proposals.filter(
    (p) => p.status === "active" || p.status === "pending"
  );
  const pastProposals = proposals.filter(
    (p) =>
      p.status === "succeeded" ||
      p.status === "failed" ||
      p.status === "executed"
  );
  const totalProposals = activeProposals.length + pastProposals.length;

  return (
    <div className="w-full flex flex-col gap-6 px-2">
      {totalProposals === 0 && (
        <EmptyComponent
          icon={<Page className="w-12 h-12 text-white" />}
          title="No proposals yet"
          description="Proposals will be displayed here once available"
        />
      )}
      {activeProposals.length > 0 && (
        <section>
          <Typography
            variant="label"
            color="default"
            className="text-gray-400 font-medium"
          >
            Active Proposal · {activeProposals.length}
          </Typography>
          <div className="flex flex-col gap-3 mt-3">
            {activeProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </section>
      )}

      {pastProposals.length > 0 && (
        <section>
          <Typography
            variant="label"
            color="default"
            className="text-gray-400 font-medium"
          >
            Past Proposals · {pastProposals.length}
          </Typography>
          <div className="flex flex-col gap-3 mt-3">
            {pastProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
