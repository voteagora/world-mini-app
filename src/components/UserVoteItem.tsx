import { Marble, Typography } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";

interface UserVoteItemProps {
  address: string;
  support: string;
  params?: string[];
  proposalType: string;
}

export function UserVoteItem({
  address,
  support,
  params,
  proposalType,
}: UserVoteItemProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { data: user } = useQuery({
    queryKey: ["user", address],
    queryFn: () => MiniKit.getUserByAddress(address),
    enabled: inView,
  });
  return (
    <Link ref={ref} href={`/delegate/${user?.username ?? address}`}>
      <div className="flex items-center gap-2">
        <Marble
          className="w-12 h-12 rounded-full flex-shrink-0"
          src="https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
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
        <Typography
          variant="subtitle"
          level={3}
          color="default"
          className={twMerge(
            "text-sm font-medium",
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
