/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Environment variables required:
 * - PRIVATE_KEY: Server wallet private key for vote submission
 * - ALCHEMY_API_KEY: Alchemy API key for blockchain interactions
 */
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { worldchain } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const GOVERNOR_ADDRESS = "0x2809b50B42F0F6a7183239416cfB19f27EA8A412";

const governorAbi = parseAbi([
  "function castVoteWithReasonAndParamsBySig(uint256 proposalId, uint8 support, address voter, string calldata reason, bytes memory params, bytes memory signature) external returns (uint256)",
]);

interface VoteRequest {
  proposalId: string;
  support: number;
  reason: string;
  encodedParams: string;
  voterAddress: string;
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const {
      proposalId,
      support,
      reason,
      encodedParams,
      voterAddress,
      signature,
    } = body;

    // Validate required fields
    if (!proposalId || support === undefined || !voterAddress || !signature) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: proposalId, support, voterAddress, and signature are required",
        },
        { status: 400 }
      );
    }

    // Validate support value (0=Against, 1=For, 2=Abstain)
    if (![0, 1, 2].includes(support)) {
      return NextResponse.json(
        {
          error:
            "Invalid support value. Must be 0 (Against), 1 (For), or 2 (Abstain)",
        },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress)) {
      return NextResponse.json(
        { error: "Invalid voter address format" },
        { status: 400 }
      );
    }

    // Validate signature format
    if (!/^0x[a-fA-F0-9]{130}$/.test(signature)) {
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 }
      );
    }

    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );

    const publicClient = createPublicClient({
      chain: worldchain,
      transport: http(
        `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ),
    });

    const walletClient = createWalletClient({
      account,
      chain: worldchain,
      transport: http(
        `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ),
    });

    console.log("Submitting vote with params:", {
      proposalId: BigInt(proposalId),
      support,
      voterAddress,
      reason: reason || "",
      encodedParams: encodedParams || "0x",
    });

    const txHash = await walletClient.writeContract({
      address: GOVERNOR_ADDRESS,
      abi: governorAbi,
      functionName: "castVoteWithReasonAndParamsBySig",
      args: [
        BigInt(proposalId),
        support,
        voterAddress as `0x${string}`,
        reason || "",
        encodedParams ? (encodedParams as `0x${string}`) : "0x",
        signature as `0x${string}`,
      ],
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      blockNumber: receipt.blockNumber.toString(),
      message: "Vote submitted successfully",
    });
  } catch (error: any) {
    console.error("Vote submission error:", error);

    // Parse specific error messages from the contract
    const errorMessage = error.message || error.toString();

    if (
      errorMessage.includes("GovernorAlreadyCastVote") ||
      errorMessage.includes("already voted")
    ) {
      return NextResponse.json(
        { error: "User has already voted on this proposal" },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes("GovernorInvalidSignature") ||
      errorMessage.includes("invalid signature")
    ) {
      return NextResponse.json(
        { error: "Invalid signature provided" },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes("GovernorNonexistentProposal") ||
      errorMessage.includes("proposal not found")
    ) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    if (errorMessage.includes("GovernorUnexpectedProposalState")) {
      return NextResponse.json(
        { error: "Proposal is not in voting state" },
        { status: 400 }
      );
    }

    if (errorMessage.includes("insufficient funds")) {
      return NextResponse.json(
        { error: "Server wallet has insufficient funds for gas" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to submit vote",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
