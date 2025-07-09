import { Marble, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { getUserByAddress } from "@/lib/server-utils";

interface UserVoteItemProps {
  address: string;
  support: string;
  params?: string[];
  proposalType: string;
}

export async function UserVoteItem({
  address,
  support,
  params,
  proposalType,
}: UserVoteItemProps) {
  const user = await getUserByAddress(address);
  if (!user || !user.username) return null;

  return (
    <Link href={`/delegate/${user?.username ?? address}`}>
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2 w-1/2">
          <Marble
            className="w-12 h-12 rounded-full flex-shrink-0"
            src={
              user?.profilePictureUrl ??
              "https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
            }
          />
          <div className="flex flex-col flex-1">
            <Typography
              variant="subtitle"
              level={3}
              color="default"
              className="text-gray-900 font-medium"
            >
              {user?.username}
            </Typography>
          </div>
        </div>
        <Typography
          variant="subtitle"
          level={3}
          color="default"
          className={twMerge(
            "text-sm font-medium w-1/2 text-right",
            support === "For"
              ? "text-green-600"
              : support === "Against"
              ? "text-gray-900"
              : "text-gray-400"
          )}
        >
          {proposalType === "approval" ? params?.join(", ") : support}
        </Typography>
      </div>
    </Link>
  );
}
