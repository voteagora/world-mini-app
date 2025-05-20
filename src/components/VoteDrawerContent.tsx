"use client";

import { useState } from "react";
import {
  Typography,
  Button,
  CircularIcon,
  TextArea,
} from "@worldcoin/mini-apps-ui-kit-react";
import { Check, Xmark } from "iconoir-react";
import { Options } from "@/components/CastVote/Options";
import { ProposalData } from "@/utils/types";

interface VoteDrawerContentProps {
  proposal: ProposalData;
  proposalType: "standard" | "optimistic" | "approval";
  initialVoteState: string | null;
}

export function VoteDrawerContent({
  proposal,
  proposalType,
  initialVoteState,
}: VoteDrawerContentProps) {
  const [voteStep, setVoteStep] = useState(1);
  const [reason, setReason] = useState("");
  const [voteState, setVoteState] = useState(initialVoteState);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmitVote = async () => {
    console.log("Submitting vote with reason:", reason);
    const mockSuccess = Math.random() > 0.5;
    if (mockSuccess) {
      setVoteState("success");
    } else {
      setVoteState("failure");
    }
  };

  if (voteState === "success") {
    return (
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
          className="text-gray-500"
        >
          Your vote has failed to be submitted. Please try again.
        </Typography>
        <Button
          variant="secondary"
          size="lg"
          className="w-full py-2 flex mt-6"
          onClick={() => {
            setVoteState(null);
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
            {/* TODO: Add max number of options based on proposal config */}
            <Options
              options={proposal.options}
              maxNumber={proposalType === "approval" ? 3 : 1}
              onSelect={(option) =>
                setSelectedOptions((prev) =>
                  Array.from(new Set([...prev, option]))
                )
              }
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
          >
            Submit vote
          </Button>
        </>
      )}
    </>
  );
}
