/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, parseAbi, encodeAbiParameters } from "viem";
import { worldchain } from "viem/chains";

const GOVERNOR_ADDRESS = "0x2809b50B42F0F6a7183239416cfB19f27EA8A412";

const governorAbi = parseAbi([
  "function nonces(address owner) external view returns (uint256)",
]);

interface VoteParamsData {
  root: string;
  nullifierHash: string;
  proof: string;
  options: number[];
}

interface PrepareRequest {
  voteParamsData: VoteParamsData;
  voterAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PrepareRequest = await request.json();
    const { voteParamsData, voterAddress } = body;

    // Validate required fields
    if (!voteParamsData || !voterAddress) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: voteParamsData and voterAddress are required",
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

    // Validate World ID proof structure
    if (
      !voteParamsData.root ||
      !voteParamsData.nullifierHash ||
      !voteParamsData.proof
    ) {
      return NextResponse.json(
        { error: "Invalid World ID proof data" },
        { status: 400 }
      );
    }

    if (
      typeof voteParamsData.proof !== "string" ||
      !voteParamsData.proof.startsWith("0x")
    ) {
      return NextResponse.json(
        { error: "Invalid World ID proof format - expected hex string" },
        { status: 400 }
      );
    }

    if (!Array.isArray(voteParamsData.options)) {
      return NextResponse.json(
        { error: "Invalid voting options format" },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: worldchain,
      transport: http(
        `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ),
    });

    // Get the current nonce for the voter (required for EIP-712 signature)
    const nonce = await publicClient.readContract({
      address: GOVERNOR_ADDRESS,
      abi: governorAbi,
      functionName: "nonces",
      args: [voterAddress as `0x${string}`],
    });

    // Encode params according to contract interface: (uint256 root, uint256 nullifierHash, bytes memory proof, uint256[] memory options)
    const encodedParams = encodeAbiParameters(
      [
        { name: "root", type: "uint256" },
        { name: "nullifierHash", type: "uint256" },
        { name: "proof", type: "bytes" },
        { name: "options", type: "uint256[]" },
      ],
      [
        BigInt(voteParamsData.root),
        BigInt(voteParamsData.nullifierHash),
        voteParamsData.proof.slice(2) as `0x${string}`,
        voteParamsData.options.map((o) => BigInt(o)),
      ]
    );

    return NextResponse.json({
      encodedParams,
      nonce: nonce.toString(),
      message: "Vote parameters prepared successfully",
    });
  } catch (error: any) {
    console.error("Vote preparation error:", error);

    const errorMessage = error.message || error.toString();

    if (errorMessage.includes("execution reverted")) {
      return NextResponse.json(
        { error: "Contract call failed - check if address is valid" },
        { status: 400 }
      );
    }

    if (errorMessage.includes("network error")) {
      return NextResponse.json(
        { error: "Network error - please try again" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to prepare vote",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
