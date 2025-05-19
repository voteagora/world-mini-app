import { proposals } from "@/utils/constants";
import { Progress, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface ParticipationItemProps {
  proposalName: string;
  proposalId: string;
  support: string;
  params?: string[];
  date: string;
}

export function ParticipationItem({
  proposalName,
  proposalId,
  support,
  params,
  date,
}: ParticipationItemProps) {
  const proposal = proposals.find((p) => p.id === proposalId);
  const percentage =
    proposal?.type === "approval"
      ? proposal?.votes[params?.[0] as keyof typeof proposal.votes]?.percentage
      : support === "For"
      ? proposal?.votes.for.percentage
      : support === "Against"
      ? proposal?.votes.against.percentage
      : proposal?.votes.abstain.percentage;
  return (
    <Link
      href={`/proposals/${proposalId}`}
      className="flex items-center justify-between gap-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col flex-1">
          <Typography
            variant="subtitle"
            level={2}
            color="default"
            className="text-gray-900 font-medium"
          >
            {proposalName}
          </Typography>
          <Typography variant="body" level={4} className="text-gray-400 mt-1">
            {date}
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Typography
              variant="subtitle"
              level={3}
              className="text-gray-900 font-medium"
            >
              {params?.length ? params.join(", ") : support}
            </Typography>
            <Typography
              variant="subtitle"
              level={3}
              className="text-gray-900 font-medium"
            >
              {percentage}
            </Typography>
          </div>
          <Progress
            value={Number.parseFloat(percentage ?? "0")}
            max={100}
            className="h-1.5 text-green-600 bg-gray-50"
          />
        </div>
      </div>
    </Link>
  );
}
