# World Vote - Governance with World ID

A decentralized governance platform that uses World ID verification to ensure only verified humans can participate in voting.

## Features

- **World ID Verification**: Uses World ID Orb verification to prevent bots and duplicate voting
- **On-chain Verification**: World ID proofs are verified directly in the smart contract
- **Dual Voting Types**: Supports both standard (For/Against/Abstain) and approval voting
- **Worldchain Integration**: Built on Worldchain with Alchemy API integration

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# World ID
NEXT_PUBLIC_WORLD_APP_ID=app_adf6164ec59ba08fe5f2aefb692a7da9

# Blockchain
ALCHEMY_API_KEY=your-alchemy-api-key
PRIVATE_KEY=0x... # Server wallet private key for vote submission

# DAO Node
DAONODE_URL=?
```

## How Voting Works

1. **Vote Initiation**: User selects their voting options and provides a reason
2. **World ID Verification**: MiniKit triggers World ID verification flow
3. **Proof Generation**: World ID generates a proof of humanity (root, nullifierHash, proof)
4. **Parameter Encoding**: Vote parameters are ABI-encoded according to contract interface:
   ```solidity
   (uint256 root, uint256 nullifierHash, uint256[8] memory proof, uint256[] memory options)
   ```
5. **On-chain Submission**: Transaction is submitted to the AgoraGovernor contract
6. **Smart Contract Verification**: Contract verifies the World ID proof and processes the vote

## Technical Architecture

### Client-Side (`VoteDrawerContent.tsx`)

- Handles World ID verification via MiniKit
- Constructs vote parameters based on proposal type
- Manages UI state for voting process

### Server-Side (`api/vote/route.ts`)

- ABI-encodes World ID proof data with voting options
- Submits transaction to governance contract
- Returns transaction confirmation

### Smart Contract Interface

The contract expects parameters in this format:

```solidity
function _decodeVoteParams(bytes memory params)
    internal
    virtual
    returns (uint256 root, uint256 nullifierHash, uint256[8] memory proof, uint256[] memory options)
{
    (root, nullifierHash, proof, options) = abi.decode(params, (uint256, uint256, uint256[8], uint256[]));
}
```

## Contract Addresses

- **Governor**: `0x2809b50B42F0F6a7183239416cfB19f27EA8A412`
- **Network**: Worldchain Mainnet

## Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.
