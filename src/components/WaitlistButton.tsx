/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { getNewNonces } from "@/auth/wallet/server-helpers";
import { setNotificationPreferences } from "@/lib/actions/notifications";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export const WaitlistButton = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const permissions: any = await MiniKit.commandsAsync.getPermissions();
      if (permissions && permissions.finalPayload?.status === "success") {
        const hasPermission =
          !!permissions.finalPayload?.permissions?.notifications;
        setIsSuccess(hasPermission);
      }
    };

    getPermissions();
  }, []);

  const onClick = async () => {
    setIsPending(true);
    try {
      const { nonce } = await getNewNonces();
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: `Authenticate (${crypto.randomUUID().replace(/-/g, "")}).`,
      });
      console.log(result);
      const payload = await MiniKit.commandsAsync.requestPermission({
        permission: Permission.Notifications,
      });
      if (
        payload.finalPayload?.status === "success" &&
        (result.finalPayload as any).walletAddress
      ) {
        setIsSuccess(true);
        await setNotificationPreferences(
          (result.finalPayload as any).walletAddress,
          true
        );
      } else {
        console.error("Failed to join waitlist", payload);
      }
    } catch (error) {
      console.error("Failed to join waitlist", error);
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
        disabled={isPending || isSuccess}
        className="w-full"
        variant="primary"
      >
        {isSuccess ? "Joined waitlist" : "Join waitlist"}
      </Button>
    </LiveFeedback>
  );
};
