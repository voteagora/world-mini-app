/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import {
  createPublicClient,
  decodeAbiParameters,
  encodeAbiParameters,
  encodePacked,
  http,
  parseAbi,
} from "viem";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { worldchain } from "viem/chains";
import { logger } from "@/lib/logger";

const governorAbi = parseAbi([
  "function castVoteWithReasonAndParams(uint256 proposalId, uint8 support, string reason, bytes params) external returns (uint256)",
]);

interface VoteDrawerContentProps {
  proposal: ProposalData;
  proposalType: "standard" | "approval";
  voteState: string | null;
  setVoteState: Dispatch<SetStateAction<string | null>>;
  walletAddress: string;
  revalidate: () => void;
}

export function VoteDrawerContent({
  proposal,
  proposalType,
  voteState,
  setVoteState,
  walletAddress,
  revalidate,
}: VoteDrawerContentProps) {
  const [voteStep, setVoteStep] = useState(1);
  const [reason, setReason] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  const { isSuccess, isError, error } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID || "",
    },
    transactionId: txHash || "",
  });

  useEffect(() => {
    if (isSuccess) {
      setVoteState("success");
      revalidate();
    }
    if (isError) {
      setVoteState("failure");
    }
  }, [isSuccess, isError, error, setVoteState, revalidate]);

  const handleWorldIDSuccess = async (result: ISuccessResult) => {
    setIsVerifying(true);
    setVoteError(null);

    try {
      const signResult = await submitVoteWithProof(result);

      if (signResult.finalPayload.status === "success") {
        setVoteState("success");
        revalidate();
      } else {
        const errorMsg =
          signResult.finalPayload.error_code || "Failed to submit vote";
        logger.log("handleWorldIDSuccess: Vote failed with error:", errorMsg);
        setVoteState("failure");
      }
    } catch (error: any) {
      logger.error("handleWorldIDSuccess: Vote submission failed:", error);
      setVoteState("failure");
    } finally {
      setIsVerifying(false);
    }
  };

  const submitVoteWithProof = async (worldIdProof: ISuccessResult) => {
    if (worldIdProof.verification_level !== VerificationLevel.Orb) {
      logger.error(
        "submitVoteWithProof: Invalid verification level:",
        worldIdProof.verification_level
      );
      throw new Error("Only Orb verification is supported");
    }

    const supportValue = getSupportValue();

    const voteParamsData = getVoteParams(worldIdProof);

    if (!voteParamsData) {
      logger.error("submitVoteWithProof: No vote params data available");
      throw new Error("Failed to get vote parameters");
    }

    if (!walletAddress) {
      logger.error("submitVoteWithProof: No wallet address available");
      throw new Error("User wallet address not available");
    }

    const decodedProof = decodeAbiParameters(
      [{ name: "proof", type: "uint256[8]" }],
      voteParamsData.proof as `0x${string}`
    );

    const voteParams = encodeAbiParameters(
      [
        { name: "root", type: "uint256" },
        { name: "nullifierHash", type: "uint256" },
        { name: "proof", type: "uint256[8]" },
        { name: "options", type: "uint256[]" },
      ],
      [
        BigInt(voteParamsData.root),
        BigInt(voteParamsData.nullifierHash),
        decodedProof?.[0],
        voteParamsData.options.map((o) => BigInt(o)),
      ]
    );

    const signResult = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address:
            "0x2809b50B42F0F6a7183239416cfB19f27EA8A412" as `0x${string}`,
          abi: governorAbi,
          functionName: "castVoteWithReasonAndParams",
          args: [proposal.id, supportValue, reason, voteParams],
        },
      ],
    });

    if (signResult.finalPayload.status === "success") {
      setTxHash(signResult.finalPayload.transaction_id);
      revalidate();
    }

    return signResult;
  };

  const getSupportValue = (): number => {
    if (proposalType === "standard") {
      if (selectedOptions.includes("For")) {
        return 1;
      }
      if (selectedOptions.includes("Against")) {
        return 0;
      }
      if (selectedOptions.includes("Abstain")) {
        return 2;
      }
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

    const params = {
      root: worldIdProof.merkle_root,
      nullifierHash: worldIdProof.nullifier_hash,
      proof: worldIdProof.proof,
      options,
    };
    return params;
  };

  const handleSubmitVote = async () => {
    if (isVerifying) {
      return;
    }

    setVoteError(null);

    const supportValue = getSupportValue();

    if (supportValue === undefined) {
      setVoteError("Please select a voting option");
      return;
    }

    if (typeof window !== "undefined") {
      if (!process.env.NEXT_PUBLIC_APP_ID) {
        setVoteState("failure");
        return;
      }

      const action = proposal.title;
      const signal = encodePacked(
        ["address", "uint256", "uint8"],
        [walletAddress as `0x${string}`, BigInt(proposal.id), supportValue]
      );

      try {
        const result = await MiniKit.commandsAsync.verify({
          action,
          signal: signal.toString(),
          verification_level: VerificationLevel.Orb,
        });

        if (result?.finalPayload?.status === "success") {
          await handleWorldIDSuccess(result.finalPayload);
        } else {
          const errorMsg =
            result?.finalPayload?.error_code || "World ID verification failed";
          logger.error(
            "handleSubmitVote: World ID verification failed:",
            errorMsg
          );
          setVoteState("failure");
        }
      } catch (error: any) {
        logger.error("handleSubmitVote: World ID verification error:", error);
        setVoteState("failure");
      }
    } else {
      setVoteState("success");
      revalidate();
    }
  };

  const handleOptionSelect = (option: string) => {
    if (proposalType === "standard") {
      setSelectedOptions([option]);
    } else {
      setSelectedOptions((prev) => {
        const newOptions = Array.from(new Set([...prev, option]));
        return newOptions;
      });
    }
  };

  const handleVoteStepContinue = () => {
    setVoteStep(2);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReason = e.target.value;
    setReason(newReason);
  };

  const handleTryAgain = () => {
    setVoteState(null);
    setVoteError(null);
    setVoteStep(1);
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
            "Your vote has failed to be submitted. If the problem persists, please contact support at pedro@voteagora.com"}
        </Typography>
        <Button
          variant="secondary"
          size="lg"
          className="w-full py-2 flex mt-6"
          onClick={handleTryAgain}
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
              onSelect={handleOptionSelect}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full py-2 flex mt-auto"
            onClick={handleVoteStepContinue}
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
              onChange={handleReasonChange}
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
  walletAddress,
  revalidate,
}: {
  proposal: ProposalData;
  hasVoted?: boolean;
  walletAddress: string;
  revalidate: () => void;
}) => {
  const [voteState, setVoteState] = useState<string | null>(
    hasVoted ? "success" : null
  );

  const isDisabled = proposal.status !== "active" || voteState === "success";

  return (
    <Drawer>
      <DrawerTrigger disabled={isDisabled} asChild>
        <Button variant="primary" size="lg" className="w-full">
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
            walletAddress={walletAddress}
            revalidate={revalidate}
          />
        </Page.Main>
      </DrawerContent>
    </Drawer>
  );
};
