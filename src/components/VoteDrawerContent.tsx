/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Confetti from "react-confetti";
import {
  Typography,
  Button,
  CircularIcon,
  TextArea,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
} from "@worldcoin/mini-apps-ui-kit-react";
import { Check, Xmark } from "iconoir-react";
import { VerificationLevel, ISuccessResult } from "@worldcoin/idkit";
import { MiniKit } from "@worldcoin/minikit-js";
import { Options } from "@/components/CastVote/Options";
import { ProposalData } from "@/utils/types";
import { Page } from "./PageLayout";

interface VoteDrawerContentProps {
  proposal: ProposalData;
  proposalType: "standard" | "approval";
  voteState: string | null;
  setVoteState: Dispatch<SetStateAction<string | null>>;
}

export function VoteDrawerContent({
  proposal,
  proposalType,
  voteState,
  setVoteState,
}: VoteDrawerContentProps) {
  const [voteStep, setVoteStep] = useState(1);
  const [reason, setReason] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const handleWorldIDSuccess = async (result: ISuccessResult) => {
    setIsVerifying(true);
    setVoteError(null);

    try {
      const voteData = await submitVoteWithProof(result);
      if (voteData.success) {
        setVoteState("success");
      } else {
        const errorMsg = voteData.error || "Failed to submit vote";
        setVoteError(errorMsg);
        setVoteState("failure");
      }
    } catch (error: any) {
      console.error("Vote submission failed:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setVoteError(errorMsg);
      setVoteState("failure");
    } finally {
      setIsVerifying(false);
    }
  };

  const submitVoteWithProof = async (worldIdProof: ISuccessResult) => {
    if (worldIdProof.verification_level !== VerificationLevel.Orb) {
      throw new Error("Only Orb verification is supported");
    }

    const supportValue = getSupportValue();
    const voteParamsData = getVoteParams(worldIdProof);

    const userInfo = MiniKit.user;
    if (!userInfo?.walletAddress) {
      throw new Error("User wallet address not available");
    }

    // Prepare vote parameters
    const response = await fetch("/api/vote/prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voteParamsData,
        voterAddress: userInfo.walletAddress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to prepare vote");
    }

    const { encodedParams, nonce } = await response.json();

    // Create EIP-712 typed data for the vote signature
    // Based on OpenZeppelin Governor EXTENDED_BALLOT_TYPEHASH
    const domain = {
      name: "AgoraGovernor",
      version: "1",
      chainId: 480,
      verifyingContract:
        "0x2809b50B42F0F6a7183239416cfB19f27EA8A412" as `0x${string}`,
    };

    const types = {
      ExtendedBallot: [
        { name: "proposalId", type: "uint256" },
        { name: "support", type: "uint8" },
        { name: "voter", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "reason", type: "string" },
        { name: "params", type: "bytes" },
      ],
    };

    const message = {
      proposalId: BigInt(proposal.id),
      support: supportValue,
      voter: userInfo.walletAddress as `0x${string}`,
      nonce: BigInt(nonce),
      reason: reason,
      params: encodedParams as `0x${string}`,
    };

    const signResult = await MiniKit.commandsAsync.signTypedData({
      domain,
      types,
      primaryType: "ExtendedBallot",
      message,
    });

    if (signResult?.finalPayload?.status !== "success") {
      throw new Error("Failed to sign vote");
    }

    const submitResponse = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proposalId: proposal.id,
        support: supportValue,
        reason,
        encodedParams,
        voterAddress: userInfo.walletAddress,
        signature: signResult.finalPayload.signature,
      }),
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      throw new Error(errorData.error || "Failed to submit vote");
    }

    return await submitResponse.json();
  };

  const getSupportValue = (): number => {
    if (proposalType === "standard") {
      if (selectedOptions.includes("For")) return 1;
      if (selectedOptions.includes("Against")) return 0;
      if (selectedOptions.includes("Abstain")) return 2;
    }
    return 1;
  };

  const getVoteParams = (worldIdProof?: ISuccessResult) => {
    if (!worldIdProof) {
      return null;
    }

    let options: number[] = [];
    if (proposalType === "approval" && selectedOptions.length > 0) {
      const optionIndices = selectedOptions
        .map((option) => proposal.options.indexOf(option))
        .filter((index) => index !== -1);
      options = optionIndices;
    }

    return {
      root: worldIdProof.merkle_root,
      nullifierHash: worldIdProof.nullifier_hash,
      proof: JSON.parse(worldIdProof.proof),
      options,
    };
  };

  const handleSubmitVote = async () => {
    if (isVerifying) return;

    setVoteError(null);

    const supportValue = getSupportValue();
    if (supportValue === undefined) {
      setVoteError("Please select a voting option");
      return;
    }

    console.log("Initiating vote submission with World ID verification");

    if (typeof window !== "undefined") {
      if (!process.env.NEXT_PUBLIC_APP_ID) {
        setVoteError("App configuration error - missing World App ID");
        setVoteState("failure");
        return;
      }

      const action = `vote_${process.env.NEXT_PUBLIC_APP_ID}`;
      const signal = `${proposal.id}_${supportValue}_${reason}`;

      try {
        const result = await MiniKit.commandsAsync.verify({
          action,
          signal,
          verification_level: VerificationLevel.Orb,
        });

        if (result?.finalPayload?.status === "success") {
          await handleWorldIDSuccess(result.finalPayload);
        } else {
          const errorMsg =
            result?.finalPayload?.error_code || "World ID verification failed";
          setVoteError(errorMsg);
          setVoteState("failure");
        }
      } catch (error: any) {
        console.error("World ID verification error:", error);
        setVoteError(error.message || "World ID verification failed");
        setVoteState("failure");
      }
    } else {
      setVoteState("success");
    }
  };

  if (voteState === "success") {
    return (
      <>
        <Confetti />
        <div className="flex flex-col gap-2 items-center justify-center h-full pt-0 mt-0">
          <CircularIcon size="xl" className="bg-green-600 mb-6">
            <Check className="text-white" />
          </CircularIcon>
          <Typography
            variant="heading"
            level={1}
            color="default"
            className="text-gray-900 font-semibold"
          >
            Voted successfully
          </Typography>
          <Typography
            variant="body"
            level={2}
            color="default"
            className="text-gray-500"
          >
            Your vote has been submitted successfully.
          </Typography>
        </div>
      </>
    );
  }

  if (voteState === "failure") {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-full pt-0 mt-0">
        <CircularIcon size="xl" className="bg-red-600 mb-6">
          <Xmark className="text-white" />
        </CircularIcon>
        <Typography
          variant="heading"
          level={1}
          color="default"
          className="text-gray-900 font-semibold"
        >
          Vote failed
        </Typography>
        <Typography
          variant="body"
          level={2}
          color="default"
          className="text-gray-500 text-center max-w-sm px-4"
        >
          {voteError ||
            "Your vote has failed to be submitted. Please try again."}
        </Typography>
        <Button
          variant="secondary"
          size="lg"
          className="w-full py-2 flex mt-6"
          onClick={() => {
            setVoteState(null);
            setVoteError(null);
            setVoteStep(1);
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {voteStep === 1 ? (
        <>
          <div className="flex flex-col gap-2">
            <Typography
              variant="heading"
              level={2}
              className="flex items-center gap-2 text-gray-900"
            >
              Cast your vote
            </Typography>
            <Typography
              variant="body"
              level={2}
              className="flex items-center gap-2 text-gray-500 mb-4"
            >
              Select your choice from the options below
            </Typography>
            <Options
              options={
                proposalType === "standard"
                  ? ["For", "Against", "Abstain"]
                  : proposal.options
              }
              maxNumber={
                proposalType === "approval" ? proposal.maxApprovals || 1 : 1
              }
              onSelect={(option) => {
                if (proposalType === "standard") {
                  setSelectedOptions([option]);
                } else {
                  setSelectedOptions((prev) =>
                    Array.from(new Set([...prev, option]))
                  );
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full py-2 flex mt-auto"
            onClick={() => setVoteStep(2)}
            disabled={selectedOptions.length === 0}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2 flex-grow">
            {" "}
            <Typography
              variant="heading"
              level={2}
              className="flex items-center gap-2 text-gray-900"
            >
              Enter your reason
            </Typography>
            <Typography
              variant="body"
              level={2}
              className="flex items-center gap-2 text-gray-500 mb-4"
            >
              Why are you voting for {selectedOptions.join(", ")}?
            </Typography>
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={80}
              // @ts-expect-error - Types are wrong for TextArea
              placeholder="Type here"
            />
            <Typography
              variant="body"
              level={4}
              className="text-left text-xs text-gray-500 mt-1 mb-2"
            >
              {reason.length}/80
            </Typography>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full py-2 flex"
            onClick={handleSubmitVote}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying with World ID..." : "Submit vote"}
          </Button>
        </>
      )}
    </>
  );
}

export const VoteDrawerContentWrapper = ({
  proposal,
  hasVoted = false,
}: {
  proposal: ProposalData;
  hasVoted?: boolean;
}) => {
  const [voteState, setVoteState] = useState<string | null>(
    hasVoted ? "success" : null
  );
  return (
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
            proposalType={proposal.type}
            voteState={voteState}
            setVoteState={setVoteState}
          />
        </Page.Main>
      </DrawerContent>
    </Drawer>
  );
};
