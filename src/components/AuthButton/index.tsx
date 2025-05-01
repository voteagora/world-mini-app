"use client";
import { walletAuth } from "@/auth/wallet";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const AuthButton = () => {
	const [isPending, setIsPending] = useState(false);
	const { isInstalled } = useMiniKit();

	const onClick = useCallback(async () => {
		if (!isInstalled || isPending) {
			return;
		}
		setIsPending(true);
		try {
			await walletAuth();
		} catch (error) {
			console.error("Wallet authentication button error", error);
			setIsPending(false);
			return;
		}

		setIsPending(false);
	}, [isInstalled, isPending]);

	return (
		<LiveFeedback
			label={{
				failed: "Failed to login",
				pending: "Logging in",
				success: "Logged in",
			}}
			state={isPending ? "pending" : undefined}
			className="w-full"
		>
			<Button
				onClick={onClick}
				disabled={isPending}
				className="w-full"
				variant="primary"
			>
				Sign in
			</Button>
		</LiveFeedback>
	);
};

export const SignOutButton = () => {
	const router = useRouter();
	const onClick = useCallback(async () => {
		await signOut();
		router.push("/");
	}, [router]);
	return <Button onClick={onClick}>Sign Out</Button>;
};
