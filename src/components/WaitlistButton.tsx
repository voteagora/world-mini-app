/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { getNewNonces } from "@/auth/wallet/server-helpers";
import { setNotificationPreferences } from "@/lib/actions/notifications";
import { useQuery } from "@tanstack/react-query";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { useState } from "react";

export const WaitlistButton = ({
  initialWalletAddress,
}: {
  initialWalletAddress?: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [walletAddress, setWalletAddress] = useState(initialWalletAddress);

  const { data } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const permissions: any = await MiniKit.commandsAsync.getPermissions();
      return permissions.finalPayload?.permissions;
    },
    enabled: !!walletAddress,
  });

  const isOnWaitlist = data?.notifications;

  const onClick = async () => {
    setIsPending(true);
    try {
      let address = walletAddress;
      if (!address) {
        const permissions: any = await MiniKit.commandsAsync.getPermissions();
        const isOnWaitlist =
          permissions.finalPayload?.permissions?.notifications;
        if (isOnWaitlist) {
          setIsSuccess(true);
          return;
        }
        const { nonce } = await getNewNonces();
        const result = await MiniKit.commandsAsync.walletAuth({
          nonce,
          expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
          statement: `Authenticate (${crypto.randomUUID().replace(/-/g, "")}).`,
        });
        address = (result.finalPayload as any).address;
        setWalletAddress(address);
      }
      const payload = await MiniKit.commandsAsync.requestPermission({
        permission: Permission.Notifications,
      });
      if (payload.finalPayload?.status === "success" && address) {
        await setNotificationPreferences(address as `0x${string}`, true);
        setIsSuccess(true);
      } else {
        console.error("Failed to join waitlist", payload);
        setIsError(true);
      }
    } catch (error) {
      console.error("Failed to join waitlist", error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LiveFeedback
      label={{
        failed: "Failed to join waitlist",
        pending: "Joining waitlist",
        success: "Joined waitlist",
      }}
      state={isPending ? "pending" : undefined}
      className="w-full"
    >
      <Button
        onClick={onClick}
        disabled={isPending || isSuccess || isOnWaitlist}
        className="w-full"
        variant="primary"
      >
        {isSuccess || isOnWaitlist
          ? "Joined waitlist"
          : isError
          ? "Failed to join waitlist, try again"
          : "Join waitlist"}
      </Button>
    </LiveFeedback>
  );
};
