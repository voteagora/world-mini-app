import { Progress, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import Link from "next/link";

interface ParticipationItemProps {
  proposalName: string;
  proposalId: string;
  support: string;
  params?: string[];
  date: string;
  percentage: string;
  isFirst: boolean;
}

export function ParticipationItem({
  proposalName,
  proposalId,
  support,
  params,
  date,
  percentage,
  isFirst,
}: ParticipationItemProps) {
  return (
    <Link
      href={`/proposals/${proposalId}`}
      className={`flex items-center justify-between gap-4 ${
        !isFirst ? "border-t border-gray-800 pt-4" : ""
      }`}
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
            value={Number.parseFloat(percentage.replace("%", "") ?? "0")}
            max={100}
            className="h-1.5 text-green-600 bg-gray-50"
          />
        </div>
      </div>
    </Link>
  );
}
