export const LENSPOST_V2_ERC721 = {
  _format: "hh-sol-artifact-1",
  contractName: "Lenspost721",
  sourceName: "contracts/Lenspost721.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_defaultAdmin",
          type: "address",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_symbol",
          type: "string",
        },
        {
          internalType: "address",
          name: "_royaltyRecipient",
          type: "address",
        },
        {
          internalType: "uint128",
          name: "_royaltyBps",
          type: "uint128",
        },
        {
          internalType: "address",
          name: "_primarySaleRecipient",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ApprovalCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalToCurrentOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "ApproveToCaller",
      type: "error",
    },
    {
      inputs: [],
      name: "BalanceQueryForZeroAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "BatchMintInvalidBatchId",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "BatchMintInvalidTokenId",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
      ],
      name: "BatchMintMetadataFrozen",
      type: "error",
    },
    {
      inputs: [],
      name: "ContractMetadataUnauthorized",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "CurrencyTransferLibFailedNativeTransfer",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "expected",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "actual",
          type: "bytes32",
        },
      ],
      name: "DelayedRevealIncorrectResultHash",
      type: "error",
    },
    {
      inputs: [],
      name: "DelayedRevealNothingToReveal",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "expected",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "actual",
          type: "uint256",
        },
      ],
      name: "DropClaimExceedLimit",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "expected",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "actual",
          type: "uint256",
        },
      ],
      name: "DropClaimExceedMaxSupply",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "expectedCurrency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "expectedPricePerToken",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "actualCurrency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "actualExpectedPricePerToken",
          type: "uint256",
        },
      ],
      name: "DropClaimInvalidTokenPrice",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "expected",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "actual",
          type: "uint256",
        },
      ],
      name: "DropClaimNotStarted",
      type: "error",
    },
    {
      inputs: [],
      name: "DropExceedMaxSupply",
      type: "error",
    },
    {
      inputs: [],
      name: "DropNoActiveCondition",
      type: "error",
    },
    {
      inputs: [],
      name: "DropUnauthorized",
      type: "error",
    },
    {
      inputs: [],
      name: "LazyMintInvalidAmount",
      type: "error",
    },
    {
      inputs: [],
      name: "LazyMintUnauthorized",
      type: "error",
    },
    {
      inputs: [],
      name: "MintToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "MintZeroQuantity",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnableUnauthorized",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnerQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      name: "PrimarySaleInvalidRecipient",
      type: "error",
    },
    {
      inputs: [],
      name: "PrimarySaleUnauthorized",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "actual",
          type: "uint256",
        },
      ],
      name: "RoyaltyExceededMaxFeeBps",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      name: "RoyaltyInvalidRecipient",
      type: "error",
    },
    {
      inputs: [],
      name: "RoyaltyUnauthorized",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFromIncorrectOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "URIQueryForNonexistentToken",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_fromTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_toTokenId",
          type: "uint256",
        },
      ],
      name: "BatchMetadataUpdate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "startTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxClaimableSupply",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "supplyClaimed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "merkleRoot",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          indexed: false,
          internalType: "struct IClaimCondition.ClaimCondition",
          name: "condition",
          type: "tuple",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "resetEligibility",
          type: "bool",
        },
      ],
      name: "ClaimConditionUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "prevURI",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "newURI",
          type: "string",
        },
      ],
      name: "ContractURIUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newRoyaltyRecipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newRoyaltyBps",
          type: "uint256",
        },
      ],
      name: "DefaultRoyalty",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "MetadataFrozen",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "prevOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnerUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      name: "PrimarySaleRecipientUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "royaltyRecipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "royaltyBps",
          type: "uint256",
        },
      ],
      name: "RoyaltyForToken",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "revealedURI",
          type: "string",
        },
      ],
      name: "TokenURIRevealed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "claimer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "startTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "quantityClaimed",
          type: "uint256",
        },
      ],
      name: "TokensClaimed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "startTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "baseURI",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "encryptedBaseURI",
          type: "bytes",
        },
      ],
      name: "TokensLazyMinted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "batchFrozen",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_pricePerToken",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "bytes32[]",
              name: "proof",
              type: "bytes32[]",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
          ],
          internalType: "struct IDropSinglePhase.AllowlistProof",
          name: "_allowlistProof",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "claim",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimCondition",
      outputs: [
        {
          internalType: "uint256",
          name: "startTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxClaimableSupply",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "supplyClaimed",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantityLimitPerWallet",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "merkleRoot",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "pricePerToken",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "currency",
          type: "address",
        },
        {
          internalType: "string",
          name: "metadata",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "contractURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "key",
          type: "bytes",
        },
      ],
      name: "encryptDecrypt",
      outputs: [
        {
          internalType: "bytes",
          name: "result",
          type: "bytes",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "encryptedData",
      outputs: [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getBaseURICount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "getBatchIdAtIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getDefaultRoyaltyInfo",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_batchId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_key",
          type: "bytes",
        },
      ],
      name: "getRevealURI",
      outputs: [
        {
          internalType: "string",
          name: "revealedURI",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "getRoyaltyInfoForToken",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
      ],
      name: "getSupplyClaimedByWallet",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_batchId",
          type: "uint256",
        },
      ],
      name: "isEncryptedBatch",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_baseURIForTokens",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "lazyMint",
      outputs: [
        {
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      name: "multicall",
      outputs: [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nextTokenIdToClaim",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nextTokenIdToMint",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "primarySaleRecipient",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_key",
          type: "bytes",
        },
      ],
      name: "reveal",
      outputs: [
        {
          internalType: "string",
          name: "revealedURI",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "royaltyInfo",
      outputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "royaltyAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "startTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxClaimableSupply",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "supplyClaimed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "merkleRoot",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          internalType: "struct IClaimCondition.ClaimCondition",
          name: "_condition",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "_resetClaimEligibility",
          type: "bool",
        },
      ],
      name: "setClaimConditions",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_uri",
          type: "string",
        },
      ],
      name: "setContractURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_royaltyRecipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_royaltyBps",
          type: "uint256",
        },
      ],
      name: "setDefaultRoyaltyInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "setOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_saleRecipient",
          type: "address",
        },
      ],
      name: "setPrimarySaleRecipient",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_bps",
          type: "uint256",
        },
      ],
      name: "setRoyaltyInfoForToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_pricePerToken",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "bytes32[]",
              name: "proof",
              type: "bytes32[]",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
          ],
          internalType: "struct IDropSinglePhase.AllowlistProof",
          name: "_allowlistProof",
          type: "tuple",
        },
      ],
      name: "verifyClaim",
      outputs: [
        {
          internalType: "bool",
          name: "isOverride",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b50604051620042a9380380620042a98339810160408190526200003491620002e8565b858585858585848460026200004a83826200043b565b5060036200005982826200043b565b505060008055506200006b866200009d565b62000080836001600160801b038416620000ef565b6200008b8162000185565b50505050505050505050505062000507565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6127108111156200012357604051630a4930ad60e31b81526127106004820152602481018290526044015b60405180910390fd5b600a80546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b6001600160a01b038116620001b957604051630f7cac3760e21b81526001600160a01b03821660048201526024016200011a565b600f80546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b80516001600160a01b03811681146200021b57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200024857600080fd5b81516001600160401b038082111562000265576200026562000220565b604051601f8301601f19908116603f0116810190828211818310171562000290576200029062000220565b8160405283815260209250866020858801011115620002ae57600080fd5b600091505b83821015620002d25785820183015181830184015290820190620002b3565b6000602085830101528094505050505092915050565b60008060008060008060c087890312156200030257600080fd5b6200030d8762000203565b60208801519096506001600160401b03808211156200032b57600080fd5b620003398a838b0162000236565b965060408901519150808211156200035057600080fd5b506200035f89828a0162000236565b945050620003706060880162000203565b60808801519093506001600160801b03811681146200038e57600080fd5b91506200039e60a0880162000203565b90509295509295509295565b600181811c90821680620003bf57607f821691505b602082108103620003e057634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000436576000816000526020600020601f850160051c81016020861015620004115750805b601f850160051c820191505b8181101562000432578281556001016200041d565b5050505b505050565b81516001600160401b0381111562000457576200045762000220565b6200046f81620004688454620003aa565b84620003e6565b602080601f831160018114620004a757600084156200048e5750858301515b600019600386901b1c1916600185901b17855562000432565b600085815260208120601f198616915b82811015620004d857888601518255948401946001909101908401620004b7565b5085821015620004f75787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b613d9280620005176000396000f3fe60806040526004361061025c5760003560e01c806370a0823111610144578063acd083f8116100b6578063d37c353b1161007a578063d37c353b14610781578063d637ed59146107a1578063e7150322146107ca578063e8a3d485146107ea578063e985e9c5146107ff578063eec8897c1461084857600080fd5b8063acd083f8146106e1578063b24f2d39146106f6578063b88d4fde14610721578063c87b56dd14610741578063ce8056421461076157600080fd5b806395d89b411161010857806395d89b411461061f5780639bcf7a15146106345780639fc4d68f14610654578063a05112fc14610674578063a22cb46514610694578063ac9650d8146106b457600080fd5b806370a082311461057e578063830405321461059e57806384bb1e42146105ce5780638da5cb5b146105e1578063938e3d7b146105ff57600080fd5b806335b65e1f116101dd578063492e224b116101a1578063492e224b146104a75780634cc157df146104c7578063600dd5ea146105095780636352211e1461052957806363b45e2d146105495780636f4f28371461055e57600080fd5b806335b65e1f146103ee5780633b1475a714610432578063426cfaf31461044757806342842e0e1461046757806342966c681461048757600080fd5b806313af40351161022457806313af40351461032c57806318160ddd1461034c57806323b872dd1461036f5780632419f51b1461038f5780632a55205a146103af57600080fd5b806301ffc9a71461026157806306fdde0314610296578063079fe40e146102b8578063081812fc146102ea578063095ea7b31461030a575b600080fd5b34801561026d57600080fd5b5061028161027c36600461305c565b610868565b60405190151581526020015b60405180910390f35b3480156102a257600080fd5b506102ab6108d5565b60405161028d91906130c9565b3480156102c457600080fd5b50600f546001600160a01b03165b6040516001600160a01b03909116815260200161028d565b3480156102f657600080fd5b506102d26103053660046130dc565b610967565b34801561031657600080fd5b5061032a610325366004613111565b6109ab565b005b34801561033857600080fd5b5061032a61034736600461313b565b610a31565b34801561035857600080fd5b50600154600054035b60405190815260200161028d565b34801561037b57600080fd5b5061032a61038a366004613156565b610a62565b34801561039b57600080fd5b506103616103aa3660046130dc565b610a6d565b3480156103bb57600080fd5b506103cf6103ca366004613192565b610ac4565b604080516001600160a01b03909316835260208301919091520161028d565b3480156103fa57600080fd5b5061036161040936600461313b565b601a546000908152601b602090815260408083206001600160a01b039094168352929052205490565b34801561043e57600080fd5b50601054610361565b34801561045357600080fd5b5061032a6104623660046131c2565b610b01565b34801561047357600080fd5b5061032a610482366004613156565b610cea565b34801561049357600080fd5b5061032a6104a23660046130dc565b610d05565b3480156104b357600080fd5b506102816104c23660046130dc565b610d10565b3480156104d357600080fd5b506104e76104e23660046130dc565b610d36565b604080516001600160a01b03909316835261ffff90911660208301520161028d565b34801561051557600080fd5b5061032a610524366004613111565b610da1565b34801561053557600080fd5b506102d26105443660046130dc565b610dd4565b34801561055557600080fd5b50600c54610361565b34801561056a57600080fd5b5061032a61057936600461313b565b610de6565b34801561058a57600080fd5b5061036161059936600461313b565b610e14565b3480156105aa57600080fd5b506102816105b93660046130dc565b600e6020526000908152604090205460ff1681565b61032a6105dc3660046132fc565b610e62565b3480156105ed57600080fd5b506009546001600160a01b03166102d2565b34801561060b57600080fd5b5061032a61061a366004613392565b610f3d565b34801561062b57600080fd5b506102ab610f6b565b34801561064057600080fd5b5061032a61064f3660046133da565b610f7a565b34801561066057600080fd5b506102ab61066f366004613447565b610faa565b34801561068057600080fd5b506102ab61068f3660046130dc565b611121565b3480156106a057600080fd5b5061032a6106af366004613492565b6111bb565b3480156106c057600080fd5b506106d46106cf3660046134ae565b611250565b60405161028d9190613522565b3480156106ed57600080fd5b50600054610361565b34801561070257600080fd5b50600a546001600160a01b03811690600160a01b900461ffff166104e7565b34801561072d57600080fd5b5061032a61073c366004613586565b6113b5565b34801561074d57600080fd5b506102ab61075c3660046130dc565b6113ff565b34801561076d57600080fd5b506102ab61077c366004613447565b611414565b34801561078d57600080fd5b5061036161079c3660046135ed565b6114d8565b3480156107ad57600080fd5b506107b6611570565b60405161028d989796959493929190613666565b3480156107d657600080fd5b506102ab6107e53660046136bb565b61162f565b3480156107f657600080fd5b506102ab6116a4565b34801561080b57600080fd5b5061028161081a366004613716565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b34801561085457600080fd5b50610281610863366004613749565b6116b1565b60006301ffc9a760e01b6001600160e01b03198316148061089957506380ac58cd60e01b6001600160e01b03198316145b806108b45750635b5e139f60e01b6001600160e01b03198316145b806108cf57506001600160e01b0319821663152a902d60e11b145b92915050565b6060600280546108e4906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054610910906137ba565b801561095d5780601f106109325761010080835404028352916020019161095d565b820191906000526020600020905b81548152906001019060200180831161094057829003601f168201915b5050505050905090565b600061097282611a15565b61098f576040516333d1c03960e21b815260040160405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006109b682610dd4565b9050806001600160a01b0316836001600160a01b0316036109ea5760405163250fdee360e21b815260040160405180910390fd5b336001600160a01b03821614610a2157610a04813361081a565b610a21576040516367d9dca160e11b815260040160405180910390fd5b610a2c838383611a40565b505050565b610a39611a9c565b610a56576040516316ccb9cb60e11b815260040160405180910390fd5b610a5f81611ac9565b50565b610a2c838383611b1b565b6000610a78600c5490565b8210610a9f57604051630793127760e11b8152600481018390526024015b60405180910390fd5b600c8281548110610ab257610ab26137ee565b90600052602060002001549050919050565b600080600080610ad386610d36565b90945084925061ffff169050612710610aec828761381a565b610af69190613831565b925050509250929050565b610b09611a9c565b610b26576040516356c4ef5160e01b815260040160405180910390fd5b601a546014548215610b70575060003360405160609190911b6001600160601b03191660208201524360348201526054016040516020818303038152906040528051906020012091505b8360200135811115610b955760405163032b539f60e11b815260040160405180910390fd5b604051806101000160405280856000013581526020018560200135815260200182815260200185606001358152602001856080013581526020018560a0013581526020018560c0016020810190610bec919061313b565b6001600160a01b03168152602001610c0760e0870187613853565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505091525080516012908155602082015160135560408201516014556060820151601555608082015160165560a082015160175560c0820151601880546001600160a01b0319166001600160a01b0390921691909117905560e0820151601990610ca290826138e1565b505050601a8290556040517f6dab9d7d05d468100139089b2516cb8ff286c3972ff070d3b509e371f0d0d4b890610cdc90869086906139c9565b60405180910390a150505050565b610a2c838383604051806020016040528060008152506113b5565b610a5f816001611cf6565b60008181526011602052604081208054829190610d2c906137ba565b9050119050919050565b6000818152600b60209081526040808320815180830190925280546001600160a01b031680835260019091015492820192909252829115610d7d5780516020820151610d97565b600a546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b610da9611a9c565b610dc657604051636fae358160e11b815260040160405180910390fd5b610dd08282611ea9565b5050565b6000610ddf82611f39565b5192915050565b610dee611a9c565b610e0b57604051631c98210f60e21b815260040160405180910390fd5b610a5f81612053565b60006001600160a01b038216610e3d576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b03166000908152600560205260409020546001600160401b031690565b610e708686868686866120cf565b601a54610e8033878787876116b1565b508560126002016000828254610e969190613a96565b90915550506000818152601b6020908152604080832033845290915281208054889290610ec4908490613a96565b90915550610ed790506000878787612136565b6000610ee38888612238565b9050806001600160a01b038916336001600160a01b03167fff097c7d8b1957a4ff09ef1361b5fb54dcede3941ba836d0beb9d10bec725de68a604051610f2b91815260200190565b60405180910390a45050505050505050565b610f45611a9c565b610f6257604051639f7f092560e01b815260040160405180910390fd5b610a5f81612245565b6060600380546108e4906137ba565b610f82611a9c565b610f9f57604051636fae358160e11b815260040160405180910390fd5b610a2c838383612321565b600083815260116020526040812080546060929190610fc8906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054610ff4906137ba565b80156110415780601f1061101657610100808354040283529160200191611041565b820191906000526020600020905b81548152906001019060200180831161102457829003601f168201915b50505050509050805160000361106a57604051635d0580b360e01b815260040160405180910390fd5b600080828060200190518101906110819190613aa9565b9150915061109082878761162f565b935080848787466040516020016110aa9493929190613b29565b60405160208183030381529060405280519060200120146111175780848787466040516020016110dd9493929190613b29565b60405160208183030381529060405280519060200120604051633364574f60e21b8152600401610a96929190918252602082015260400190565b5050509392505050565b6011602052600090815260409020805461113a906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054611166906137ba565b80156111b35780601f10611188576101008083540402835291602001916111b3565b820191906000526020600020905b81548152906001019060200180831161119657829003601f168201915b505050505081565b336001600160a01b038316036111e45760405163b06307db60e01b815260040160405180910390fd5b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6060816001600160401b0381111561126a5761126a613231565b60405190808252806020026020018201604052801561129d57816020015b60608152602001906001900390816112885790505b509050336000805b848110156113ac57811561132457611302308787848181106112c9576112c96137ee565b90506020028101906112db9190613853565b866040516020016112ee93929190613b52565b6040516020818303038152906040526123d4565b848281518110611314576113146137ee565b60200260200101819052506113a4565b6113863087878481811061133a5761133a6137ee565b905060200281019061134c9190613853565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506123d492505050565b848281518110611398576113986137ee565b60200260200101819052505b6001016112a5565b50505092915050565b6113c0848484611b1b565b6001600160a01b0383163b156113f9576113dc848484846123f9565b6113f9576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b6060600061140d60006124e5565b9392505050565b606061141e611a9c565b61145b5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610a96565b600061146685610a6d565b9050611473818585610faa565b915061148e8160405180602001604052806000815250612663565b611498818361267b565b847f6df1d8db2a036436ffe0b2d1833f2c5f1e624818dfce2578c0faa4b83ef9998d836040516114c891906130c9565b60405180910390a2509392505050565b60008115611559576000806114ef84860186613b73565b91509150815160001415801561150457508015155b15611556576115568860105461151a9190613a96565b86868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061266392505050565b50505b6115668686868686612705565b9695505050505050565b60128054601354601454601554601654601754601854601980549798969795969495939492936001600160a01b0390921692916115ac906137ba565b80601f01602080910402602001604051908101604052809291908181526020018280546115d8906137ba565b80156116255780601f106115fa57610100808354040283529160200191611625565b820191906000526020600020905b81548152906001019060200180831161160857829003601f168201915b5050505050905088565b8251604080518083016020019091528181529060005b8181101561169b57600085858360405160200161166493929190613bb7565b60408051601f19818403018152919052805160209182012088840182015118858401820152611694915082613a96565b9050611645565b50509392505050565b6008805461113a906137ba565b60408051610100810182526012805482526013546020830152601454928201929092526015546060820152601654608082015260175460a08201526018546001600160a01b031660c082015260198054600093849392909160e084019190611718906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054611744906137ba565b80156117915780601f1061176657610100808354040283529160200191611791565b820191906000526020600020905b81548152906001019060200180831161177457829003601f168201915b50505091909252505050606081015160a082015160c0830151608084015193945091929091901561183f5761183b6117c98780613bc9565b86608001518d8a602001358b604001358c60600160208101906117ec919061313b565b6040516001600160601b0319606095861b811660208301526034820194909452605481019290925290921b166074820152608801604051602081830303815290604052805190602001206127fc565b5094505b84156118c6578560200135600003611857578261185d565b85602001355b92506000198660400135036118725781611878565b85604001355b91506000198660400135141580156118a95750600061189d608088016060890161313b565b6001600160a01b031614155b6118b357806118c3565b6118c3608087016060880161313b565b90505b601a546000908152601b602090815260408083206001600160a01b03808f168552925290912054908981169083161415806119015750828814155b156119405760405163f13474e960e01b81526001600160a01b03808b166004830152602482018a90528316604482015260648101849052608401610a96565b891580611955575083611953828c613a96565b115b156119875783611965828c613a96565b604051639e7762db60e01b815260048101929092526024820152604401610a96565b84602001518a866040015161199c9190613a96565b11156119d95784602001518a86604001516119b79190613a96565b60405163fe381cc960e01b815260048101929092526024820152604401610a96565b8451421015611a075784516040516322b1048f60e11b81526004810191909152426024820152604401610a96565b505050505095945050505050565b60008054821080156108cf575050600090815260046020526040902054600160e01b900460ff161590565b60008281526006602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6000611ab06009546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6000611b2682611f39565b9050836001600160a01b031681600001516001600160a01b031614611b5d5760405162a1148160e81b815260040160405180910390fd5b6000336001600160a01b0386161480611b7b5750611b7b853361081a565b80611b96575033611b8b84610967565b6001600160a01b0316145b905080611bb657604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b038416611bdd57604051633a954ecd60e21b815260040160405180910390fd5b611be960008487611a40565b6001600160a01b038581166000908152600560209081526040808320805467ffffffffffffffff198082166001600160401b0392831660001901831617909255898616808652838620805493841693831660019081018416949094179055898652600490945282852080546001600160e01b031916909417600160a01b42909216919091021783558701808452922080549193909116611cbd576000548214611cbd57805460208601516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b0316600080516020613d3d83398151915260405160405180910390a45050505050565b6000611d0183611f39565b80519091508215611d67576000336001600160a01b0383161480611d2a5750611d2a823361081a565b80611d45575033611d3a86610967565b6001600160a01b0316145b905080611d6557604051632ce44b5f60e11b815260040160405180910390fd5b505b611d7360008583611a40565b6001600160a01b0380821660008181526005602090815260408083208054600160801b6000196001600160401b0380841691909101811667ffffffffffffffff198416811783900482166001908101831690930277ffffffffffffffff0000000000000000ffffffffffffffff19909416179290921783558b86526004909452828520805460ff60e01b1942909316600160a01b026001600160e01b03199091169097179690961716600160e01b178555918901808452922080549194909116611e71576000548214611e7157805460208701516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038716171781555b5050604051869250600091506001600160a01b03841690600080516020613d3d833981519152908390a4505060018054810190555050565b612710811115611ed757604051630a4930ad60e31b8152612710600482015260248101829052604401610a96565b600a80546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b60408051606081018252600080825260208201819052918101919091528160005481101561203a57600081815260046020908152604091829020825160608101845290546001600160a01b0381168252600160a01b81046001600160401b031692820192909252600160e01b90910460ff161515918101829052906120385780516001600160a01b031615611fcf579392505050565b5060001901600081815260046020908152604091829020825160608101845290546001600160a01b038116808352600160a01b82046001600160401b031693830193909352600160e01b900460ff1615159281019290925215612033579392505050565b611fcf565b505b604051636f96cda160e11b815260040160405180910390fd5b6001600160a01b03811661208557604051630f7cac3760e21b81526001600160a01b0382166004820152602401610a96565b600f80546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b601054856000546120e09190613a96565b111561212e5760405162461bcd60e51b815260206004820152601860248201527f4e6f7420656e6f756768206d696e74656420746f6b656e7300000000000000006044820152606401610a96565b505050505050565b8060000361217a5734156121755760405162461bcd60e51b81526020600482015260066024820152652156616c756560d01b6044820152606401610a96565b6113f9565b6000612186828561381a565b9050600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038516016121b857503481146121bc565b5034155b806121fd5760405162461bcd60e51b8152602060048201526011602482015270496e76616c6964206d73672076616c756560781b6044820152606401610a96565b60006001600160a01b038716156122145786612221565b600f546001600160a01b03165b905061222f85338386612887565b50505050505050565b6000546108cf83836128c8565b600060088054612254906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054612280906137ba565b80156122cd5780601f106122a2576101008083540402835291602001916122cd565b820191906000526020600020905b8154815290600101906020018083116122b057829003601f168201915b5050505050905081600890816122e391906138e1565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168183604051612315929190613c12565b60405180910390a15050565b61271081111561234f57604051630a4930ad60e31b8152612710600482015260248101829052604401610a96565b6040805180820182526001600160a01b0384811680835260208084018681526000898152600b8352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910160405180910390a3505050565b606061140d8383604051806060016040528060278152602001613d16602791396128e2565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a029061242e903390899088908890600401613c40565b6020604051808303816000875af1925050508015612469575060408051601f3d908101601f1916820190925261246691810190613c73565b60015b6124c7573d808015612497576040519150601f19603f3d011682016040523d82523d6000602084013e61249c565b606091505b5080516000036124bf576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b606060006124f2600c5490565b90506000600c80548060200260200160405190810160405280929190818152602001828054801561254257602002820191906000526020600020905b81548152602001906001019080831161252e575b5050505050905060005b8281101561264657818181518110612566576125666137ee565b602002602001015185101561263457600d600083838151811061258b5761258b6137ee565b6020026020010151815260200190815260200160002080546125ac906137ba565b80601f01602080910402602001604051908101604052809291908181526020018280546125d8906137ba565b80156126255780601f106125fa57610100808354040283529160200191612625565b820191906000526020600020905b81548152906001019060200180831161260857829003601f168201915b50505050509350505050919050565b61263f600182613a96565b905061254c565b506040516309797f6960e21b815260048101859052602401610a96565b6000828152601160205260409020610a2c82826138e1565b6000828152600e602052604090205460ff16156126ae57604051635d079ac960e11b815260048101839052602401610a96565b6000828152600d602052604090206126c682826138e1565b507f6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c6126f183612950565b604080519182526020820185905201612315565b600061270f611a9c565b61272c5760405163f409ec7360e01b815260040160405180910390fd5b8560000361274d57604051638fd36a9b60e01b815260040160405180910390fd5b60006010549050612795818888888080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612a4292505050565b6010919091559150807f2a0365091ef1a40953c670dce28177e37520648a6fdc91506bffac0ab045570d60016127cb8a84613a96565b6127d59190613c90565b888888886040516127ea959493929190613ca3565b60405180910390a25095945050505050565b6000808281805b878110156128785761281660028361381a565b9150600089898381811061282c5761282c6137ee565b905060200201359050808411612851576000848152602082905260409020935061286f565b6000818152602085905260409020935061286c600184613a96565b92505b50600101612803565b50941496939550929350505050565b80156113f95773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038516016128bc576121758282612aa6565b6113f984848484612b2c565b610dd0828260405180602001604052806000815250612b7f565b6060600080856001600160a01b0316856040516128ff9190613cdc565b600060405180830381855af49150503d806000811461293a576040519150601f19603f3d011682016040523d82523d6000602084013e61293f565b606091505b509150915061156686838387612d22565b60008061295c600c5490565b90506000600c8054806020026020016040519081016040528092919081815260200182805480156129ac57602002820191906000526020600020905b815481526020019060010190808311612998575b5050505050905060005b82811015612a25578181815181106129d0576129d06137ee565b60200260200101518503612a1d578015612a1257816129f0600183613c90565b81518110612a0057612a006137ee565b60200260200101519350505050919050565b506000949350505050565b6001016129b6565b50604051630793127760e11b815260048101859052602401610a96565b600080612a4f8486613a96565b600c8054600181019091557fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7018190556000818152600d60205260409020909250829150612a9d84826138e1565b50935093915050565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612af3576040519150601f19603f3d011682016040523d82523d6000602084013e612af8565b606091505b5050905080610a2c57604051635fdc4ec160e11b81526001600160a01b038416600482015260248101839052604401610a96565b816001600160a01b0316836001600160a01b031603156113f957306001600160a01b03841603612b6a576121756001600160a01b0385168383612d9b565b6113f96001600160a01b038516848484612dfe565b6000546001600160a01b038416612ba857604051622e076360e81b815260040160405180910390fd5b82600003612bc95760405163b562e8dd60e01b815260040160405180910390fd5b6001600160a01b038416600081815260056020908152604080832080546fffffffffffffffffffffffffffffffff1981166001600160401b038083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b01811690920217909155858452600490925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b15612cdf575b60405182906001600160a01b03881690600090600080516020613d3d833981519152908290a4612ca860008784806001019550876123f9565b612cc5576040516368d2bf6b60e11b815260040160405180910390fd5b808210612c6f578260005414612cda57600080fd5b612d12565b5b6040516001830192906001600160a01b03881690600090600080516020613d3d833981519152908290a4808210612ce0575b5060009081556113f99085838684565b60608315612d91578251600003612d8a576001600160a01b0385163b612d8a5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a96565b50816124dd565b6124dd8383612e36565b6040516001600160a01b038316602482015260448101829052610a2c90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612e60565b6040516001600160a01b03808516602483015283166044820152606481018290526113f99085906323b872dd60e01b90608401612dc7565b815115612e465781518083602001fd5b8060405162461bcd60e51b8152600401610a9691906130c9565b6000612eb5826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612f329092919063ffffffff16565b805190915015610a2c5780806020019051810190612ed39190613cf8565b610a2c5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610a96565b60606124dd8484600085856001600160a01b0385163b612f945760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a96565b600080866001600160a01b03168587604051612fb09190613cdc565b60006040518083038185875af1925050503d8060008114612fed576040519150601f19603f3d011682016040523d82523d6000602084013e612ff2565b606091505b509150915061300282828661300d565b979650505050505050565b6060831561301c57508161140d565b82511561302c5782518084602001fd5b8160405162461bcd60e51b8152600401610a9691906130c9565b6001600160e01b031981168114610a5f57600080fd5b60006020828403121561306e57600080fd5b813561140d81613046565b60005b8381101561309457818101518382015260200161307c565b50506000910152565b600081518084526130b5816020860160208601613079565b601f01601f19169290920160200192915050565b60208152600061140d602083018461309d565b6000602082840312156130ee57600080fd5b5035919050565b80356001600160a01b038116811461310c57600080fd5b919050565b6000806040838503121561312457600080fd5b61312d836130f5565b946020939093013593505050565b60006020828403121561314d57600080fd5b61140d826130f5565b60008060006060848603121561316b57600080fd5b613174846130f5565b9250613182602085016130f5565b9150604084013590509250925092565b600080604083850312156131a557600080fd5b50508035926020909101359150565b8015158114610a5f57600080fd5b600080604083850312156131d557600080fd5b82356001600160401b038111156131eb57600080fd5b830161010081860312156131fe57600080fd5b9150602083013561320e816131b4565b809150509250929050565b60006080828403121561322b57600080fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171561326f5761326f613231565b604052919050565b60006001600160401b0382111561329057613290613231565b50601f01601f191660200190565b60006132b16132ac84613277565b613247565b90508281528383830111156132c557600080fd5b828260208301376000602084830101529392505050565b600082601f8301126132ed57600080fd5b61140d8383356020850161329e565b60008060008060008060c0878903121561331557600080fd5b61331e876130f5565b955060208701359450613333604088016130f5565b93506060870135925060808701356001600160401b038082111561335657600080fd5b6133628a838b01613219565b935060a089013591508082111561337857600080fd5b5061338589828a016132dc565b9150509295509295509295565b6000602082840312156133a457600080fd5b81356001600160401b038111156133ba57600080fd5b8201601f810184136133cb57600080fd5b6124dd8482356020840161329e565b6000806000606084860312156133ef57600080fd5b83359250613182602085016130f5565b60008083601f84011261341157600080fd5b5081356001600160401b0381111561342857600080fd5b60208301915083602082850101111561344057600080fd5b9250929050565b60008060006040848603121561345c57600080fd5b8335925060208401356001600160401b0381111561347957600080fd5b613485868287016133ff565b9497909650939450505050565b600080604083850312156134a557600080fd5b6131fe836130f5565b600080602083850312156134c157600080fd5b82356001600160401b03808211156134d857600080fd5b818501915085601f8301126134ec57600080fd5b8135818111156134fb57600080fd5b8660208260051b850101111561351057600080fd5b60209290920196919550909350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561357957603f1988860301845261356785835161309d565b9450928501929085019060010161354b565b5092979650505050505050565b6000806000806080858703121561359c57600080fd5b6135a5856130f5565b93506135b3602086016130f5565b92506040850135915060608501356001600160401b038111156135d557600080fd5b6135e1878288016132dc565b91505092959194509250565b60008060008060006060868803121561360557600080fd5b8535945060208601356001600160401b038082111561362357600080fd5b61362f89838a016133ff565b9096509450604088013591508082111561364857600080fd5b50613655888289016133ff565b969995985093965092949392505050565b60006101008a83528960208401528860408401528760608401528660808401528560a084015260018060a01b03851660c08401528060e08401526136ac8184018561309d565b9b9a5050505050505050505050565b6000806000604084860312156136d057600080fd5b83356001600160401b03808211156136e757600080fd5b6136f3878388016132dc565b9450602086013591508082111561370957600080fd5b50613485868287016133ff565b6000806040838503121561372957600080fd5b613732836130f5565b9150613740602084016130f5565b90509250929050565b600080600080600060a0868803121561376157600080fd5b61376a866130f5565b94506020860135935061377f604087016130f5565b92506060860135915060808601356001600160401b038111156137a157600080fd5b6137ad88828901613219565b9150509295509295909350565b600181811c908216806137ce57607f821691505b60208210810361322b57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176108cf576108cf613804565b60008261384e57634e487b7160e01b600052601260045260246000fd5b500490565b6000808335601e1984360301811261386a57600080fd5b8301803591506001600160401b0382111561388457600080fd5b60200191503681900382131561344057600080fd5b601f821115610a2c576000816000526020600020601f850160051c810160208610156138c25750805b601f850160051c820191505b8181101561212e578281556001016138ce565b81516001600160401b038111156138fa576138fa613231565b61390e8161390884546137ba565b84613899565b602080601f831160018114613943576000841561392b5750858301515b600019600386901b1c1916600185901b17855561212e565b600085815260208120601f198616915b8281101561397257888601518255948401946001909101908401613953565b50858210156139905787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60408152823560408201526020830135606082015260408301356080820152606083013560a0820152608083013560c082015260a083013560e08201526000613a1460c085016130f5565b6001600160a01b03166101008381019190915260e08501359036869003601e19018212613a4057600080fd5b602091860191820191356001600160401b03811115613a5e57600080fd5b803603831315613a6d57600080fd5b81610120860152613a83610140860182856139a0565b935050505061140d602083018415159052565b808201808211156108cf576108cf613804565b60008060408385031215613abc57600080fd5b82516001600160401b03811115613ad257600080fd5b8301601f81018513613ae357600080fd5b8051613af16132ac82613277565b818152866020838501011115613b0657600080fd5b613b17826020830160208601613079565b60209590950151949694955050505050565b60008551613b3b818460208a01613079565b820184868237909301918252506020019392505050565b8284823760609190911b6001600160601b0319169101908152601401919050565b60008060408385031215613b8657600080fd5b82356001600160401b03811115613b9c57600080fd5b613ba8858286016132dc565b95602094909401359450505050565b82848237909101908152602001919050565b6000808335601e19843603018112613be057600080fd5b8301803591506001600160401b03821115613bfa57600080fd5b6020019150600581901b360382131561344057600080fd5b604081526000613c25604083018561309d565b8281036020840152613c37818561309d565b95945050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906115669083018461309d565b600060208284031215613c8557600080fd5b815161140d81613046565b818103818111156108cf576108cf613804565b858152606060208201526000613cbd6060830186886139a0565b8281036040840152613cd08185876139a0565b98975050505050505050565b60008251613cee818460208701613079565b9190910192915050565b600060208284031215613d0a57600080fd5b815161140d816131b456fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa26469706673582212207ead92dd017670971eeac5f9fec906766aad3fb44495598795f46c6c6d0a1f2864736f6c63430008180033",
  deployedBytecode:
    "0x60806040526004361061025c5760003560e01c806370a0823111610144578063acd083f8116100b6578063d37c353b1161007a578063d37c353b14610781578063d637ed59146107a1578063e7150322146107ca578063e8a3d485146107ea578063e985e9c5146107ff578063eec8897c1461084857600080fd5b8063acd083f8146106e1578063b24f2d39146106f6578063b88d4fde14610721578063c87b56dd14610741578063ce8056421461076157600080fd5b806395d89b411161010857806395d89b411461061f5780639bcf7a15146106345780639fc4d68f14610654578063a05112fc14610674578063a22cb46514610694578063ac9650d8146106b457600080fd5b806370a082311461057e578063830405321461059e57806384bb1e42146105ce5780638da5cb5b146105e1578063938e3d7b146105ff57600080fd5b806335b65e1f116101dd578063492e224b116101a1578063492e224b146104a75780634cc157df146104c7578063600dd5ea146105095780636352211e1461052957806363b45e2d146105495780636f4f28371461055e57600080fd5b806335b65e1f146103ee5780633b1475a714610432578063426cfaf31461044757806342842e0e1461046757806342966c681461048757600080fd5b806313af40351161022457806313af40351461032c57806318160ddd1461034c57806323b872dd1461036f5780632419f51b1461038f5780632a55205a146103af57600080fd5b806301ffc9a71461026157806306fdde0314610296578063079fe40e146102b8578063081812fc146102ea578063095ea7b31461030a575b600080fd5b34801561026d57600080fd5b5061028161027c36600461305c565b610868565b60405190151581526020015b60405180910390f35b3480156102a257600080fd5b506102ab6108d5565b60405161028d91906130c9565b3480156102c457600080fd5b50600f546001600160a01b03165b6040516001600160a01b03909116815260200161028d565b3480156102f657600080fd5b506102d26103053660046130dc565b610967565b34801561031657600080fd5b5061032a610325366004613111565b6109ab565b005b34801561033857600080fd5b5061032a61034736600461313b565b610a31565b34801561035857600080fd5b50600154600054035b60405190815260200161028d565b34801561037b57600080fd5b5061032a61038a366004613156565b610a62565b34801561039b57600080fd5b506103616103aa3660046130dc565b610a6d565b3480156103bb57600080fd5b506103cf6103ca366004613192565b610ac4565b604080516001600160a01b03909316835260208301919091520161028d565b3480156103fa57600080fd5b5061036161040936600461313b565b601a546000908152601b602090815260408083206001600160a01b039094168352929052205490565b34801561043e57600080fd5b50601054610361565b34801561045357600080fd5b5061032a6104623660046131c2565b610b01565b34801561047357600080fd5b5061032a610482366004613156565b610cea565b34801561049357600080fd5b5061032a6104a23660046130dc565b610d05565b3480156104b357600080fd5b506102816104c23660046130dc565b610d10565b3480156104d357600080fd5b506104e76104e23660046130dc565b610d36565b604080516001600160a01b03909316835261ffff90911660208301520161028d565b34801561051557600080fd5b5061032a610524366004613111565b610da1565b34801561053557600080fd5b506102d26105443660046130dc565b610dd4565b34801561055557600080fd5b50600c54610361565b34801561056a57600080fd5b5061032a61057936600461313b565b610de6565b34801561058a57600080fd5b5061036161059936600461313b565b610e14565b3480156105aa57600080fd5b506102816105b93660046130dc565b600e6020526000908152604090205460ff1681565b61032a6105dc3660046132fc565b610e62565b3480156105ed57600080fd5b506009546001600160a01b03166102d2565b34801561060b57600080fd5b5061032a61061a366004613392565b610f3d565b34801561062b57600080fd5b506102ab610f6b565b34801561064057600080fd5b5061032a61064f3660046133da565b610f7a565b34801561066057600080fd5b506102ab61066f366004613447565b610faa565b34801561068057600080fd5b506102ab61068f3660046130dc565b611121565b3480156106a057600080fd5b5061032a6106af366004613492565b6111bb565b3480156106c057600080fd5b506106d46106cf3660046134ae565b611250565b60405161028d9190613522565b3480156106ed57600080fd5b50600054610361565b34801561070257600080fd5b50600a546001600160a01b03811690600160a01b900461ffff166104e7565b34801561072d57600080fd5b5061032a61073c366004613586565b6113b5565b34801561074d57600080fd5b506102ab61075c3660046130dc565b6113ff565b34801561076d57600080fd5b506102ab61077c366004613447565b611414565b34801561078d57600080fd5b5061036161079c3660046135ed565b6114d8565b3480156107ad57600080fd5b506107b6611570565b60405161028d989796959493929190613666565b3480156107d657600080fd5b506102ab6107e53660046136bb565b61162f565b3480156107f657600080fd5b506102ab6116a4565b34801561080b57600080fd5b5061028161081a366004613716565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b34801561085457600080fd5b50610281610863366004613749565b6116b1565b60006301ffc9a760e01b6001600160e01b03198316148061089957506380ac58cd60e01b6001600160e01b03198316145b806108b45750635b5e139f60e01b6001600160e01b03198316145b806108cf57506001600160e01b0319821663152a902d60e11b145b92915050565b6060600280546108e4906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054610910906137ba565b801561095d5780601f106109325761010080835404028352916020019161095d565b820191906000526020600020905b81548152906001019060200180831161094057829003601f168201915b5050505050905090565b600061097282611a15565b61098f576040516333d1c03960e21b815260040160405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006109b682610dd4565b9050806001600160a01b0316836001600160a01b0316036109ea5760405163250fdee360e21b815260040160405180910390fd5b336001600160a01b03821614610a2157610a04813361081a565b610a21576040516367d9dca160e11b815260040160405180910390fd5b610a2c838383611a40565b505050565b610a39611a9c565b610a56576040516316ccb9cb60e11b815260040160405180910390fd5b610a5f81611ac9565b50565b610a2c838383611b1b565b6000610a78600c5490565b8210610a9f57604051630793127760e11b8152600481018390526024015b60405180910390fd5b600c8281548110610ab257610ab26137ee565b90600052602060002001549050919050565b600080600080610ad386610d36565b90945084925061ffff169050612710610aec828761381a565b610af69190613831565b925050509250929050565b610b09611a9c565b610b26576040516356c4ef5160e01b815260040160405180910390fd5b601a546014548215610b70575060003360405160609190911b6001600160601b03191660208201524360348201526054016040516020818303038152906040528051906020012091505b8360200135811115610b955760405163032b539f60e11b815260040160405180910390fd5b604051806101000160405280856000013581526020018560200135815260200182815260200185606001358152602001856080013581526020018560a0013581526020018560c0016020810190610bec919061313b565b6001600160a01b03168152602001610c0760e0870187613853565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505091525080516012908155602082015160135560408201516014556060820151601555608082015160165560a082015160175560c0820151601880546001600160a01b0319166001600160a01b0390921691909117905560e0820151601990610ca290826138e1565b505050601a8290556040517f6dab9d7d05d468100139089b2516cb8ff286c3972ff070d3b509e371f0d0d4b890610cdc90869086906139c9565b60405180910390a150505050565b610a2c838383604051806020016040528060008152506113b5565b610a5f816001611cf6565b60008181526011602052604081208054829190610d2c906137ba565b9050119050919050565b6000818152600b60209081526040808320815180830190925280546001600160a01b031680835260019091015492820192909252829115610d7d5780516020820151610d97565b600a546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b610da9611a9c565b610dc657604051636fae358160e11b815260040160405180910390fd5b610dd08282611ea9565b5050565b6000610ddf82611f39565b5192915050565b610dee611a9c565b610e0b57604051631c98210f60e21b815260040160405180910390fd5b610a5f81612053565b60006001600160a01b038216610e3d576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b03166000908152600560205260409020546001600160401b031690565b610e708686868686866120cf565b601a54610e8033878787876116b1565b508560126002016000828254610e969190613a96565b90915550506000818152601b6020908152604080832033845290915281208054889290610ec4908490613a96565b90915550610ed790506000878787612136565b6000610ee38888612238565b9050806001600160a01b038916336001600160a01b03167fff097c7d8b1957a4ff09ef1361b5fb54dcede3941ba836d0beb9d10bec725de68a604051610f2b91815260200190565b60405180910390a45050505050505050565b610f45611a9c565b610f6257604051639f7f092560e01b815260040160405180910390fd5b610a5f81612245565b6060600380546108e4906137ba565b610f82611a9c565b610f9f57604051636fae358160e11b815260040160405180910390fd5b610a2c838383612321565b600083815260116020526040812080546060929190610fc8906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054610ff4906137ba565b80156110415780601f1061101657610100808354040283529160200191611041565b820191906000526020600020905b81548152906001019060200180831161102457829003601f168201915b50505050509050805160000361106a57604051635d0580b360e01b815260040160405180910390fd5b600080828060200190518101906110819190613aa9565b9150915061109082878761162f565b935080848787466040516020016110aa9493929190613b29565b60405160208183030381529060405280519060200120146111175780848787466040516020016110dd9493929190613b29565b60405160208183030381529060405280519060200120604051633364574f60e21b8152600401610a96929190918252602082015260400190565b5050509392505050565b6011602052600090815260409020805461113a906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054611166906137ba565b80156111b35780601f10611188576101008083540402835291602001916111b3565b820191906000526020600020905b81548152906001019060200180831161119657829003601f168201915b505050505081565b336001600160a01b038316036111e45760405163b06307db60e01b815260040160405180910390fd5b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6060816001600160401b0381111561126a5761126a613231565b60405190808252806020026020018201604052801561129d57816020015b60608152602001906001900390816112885790505b509050336000805b848110156113ac57811561132457611302308787848181106112c9576112c96137ee565b90506020028101906112db9190613853565b866040516020016112ee93929190613b52565b6040516020818303038152906040526123d4565b848281518110611314576113146137ee565b60200260200101819052506113a4565b6113863087878481811061133a5761133a6137ee565b905060200281019061134c9190613853565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506123d492505050565b848281518110611398576113986137ee565b60200260200101819052505b6001016112a5565b50505092915050565b6113c0848484611b1b565b6001600160a01b0383163b156113f9576113dc848484846123f9565b6113f9576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b6060600061140d60006124e5565b9392505050565b606061141e611a9c565b61145b5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610a96565b600061146685610a6d565b9050611473818585610faa565b915061148e8160405180602001604052806000815250612663565b611498818361267b565b847f6df1d8db2a036436ffe0b2d1833f2c5f1e624818dfce2578c0faa4b83ef9998d836040516114c891906130c9565b60405180910390a2509392505050565b60008115611559576000806114ef84860186613b73565b91509150815160001415801561150457508015155b15611556576115568860105461151a9190613a96565b86868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061266392505050565b50505b6115668686868686612705565b9695505050505050565b60128054601354601454601554601654601754601854601980549798969795969495939492936001600160a01b0390921692916115ac906137ba565b80601f01602080910402602001604051908101604052809291908181526020018280546115d8906137ba565b80156116255780601f106115fa57610100808354040283529160200191611625565b820191906000526020600020905b81548152906001019060200180831161160857829003601f168201915b5050505050905088565b8251604080518083016020019091528181529060005b8181101561169b57600085858360405160200161166493929190613bb7565b60408051601f19818403018152919052805160209182012088840182015118858401820152611694915082613a96565b9050611645565b50509392505050565b6008805461113a906137ba565b60408051610100810182526012805482526013546020830152601454928201929092526015546060820152601654608082015260175460a08201526018546001600160a01b031660c082015260198054600093849392909160e084019190611718906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054611744906137ba565b80156117915780601f1061176657610100808354040283529160200191611791565b820191906000526020600020905b81548152906001019060200180831161177457829003601f168201915b50505091909252505050606081015160a082015160c0830151608084015193945091929091901561183f5761183b6117c98780613bc9565b86608001518d8a602001358b604001358c60600160208101906117ec919061313b565b6040516001600160601b0319606095861b811660208301526034820194909452605481019290925290921b166074820152608801604051602081830303815290604052805190602001206127fc565b5094505b84156118c6578560200135600003611857578261185d565b85602001355b92506000198660400135036118725781611878565b85604001355b91506000198660400135141580156118a95750600061189d608088016060890161313b565b6001600160a01b031614155b6118b357806118c3565b6118c3608087016060880161313b565b90505b601a546000908152601b602090815260408083206001600160a01b03808f168552925290912054908981169083161415806119015750828814155b156119405760405163f13474e960e01b81526001600160a01b03808b166004830152602482018a90528316604482015260648101849052608401610a96565b891580611955575083611953828c613a96565b115b156119875783611965828c613a96565b604051639e7762db60e01b815260048101929092526024820152604401610a96565b84602001518a866040015161199c9190613a96565b11156119d95784602001518a86604001516119b79190613a96565b60405163fe381cc960e01b815260048101929092526024820152604401610a96565b8451421015611a075784516040516322b1048f60e11b81526004810191909152426024820152604401610a96565b505050505095945050505050565b60008054821080156108cf575050600090815260046020526040902054600160e01b900460ff161590565b60008281526006602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6000611ab06009546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6000611b2682611f39565b9050836001600160a01b031681600001516001600160a01b031614611b5d5760405162a1148160e81b815260040160405180910390fd5b6000336001600160a01b0386161480611b7b5750611b7b853361081a565b80611b96575033611b8b84610967565b6001600160a01b0316145b905080611bb657604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b038416611bdd57604051633a954ecd60e21b815260040160405180910390fd5b611be960008487611a40565b6001600160a01b038581166000908152600560209081526040808320805467ffffffffffffffff198082166001600160401b0392831660001901831617909255898616808652838620805493841693831660019081018416949094179055898652600490945282852080546001600160e01b031916909417600160a01b42909216919091021783558701808452922080549193909116611cbd576000548214611cbd57805460208601516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b0316600080516020613d3d83398151915260405160405180910390a45050505050565b6000611d0183611f39565b80519091508215611d67576000336001600160a01b0383161480611d2a5750611d2a823361081a565b80611d45575033611d3a86610967565b6001600160a01b0316145b905080611d6557604051632ce44b5f60e11b815260040160405180910390fd5b505b611d7360008583611a40565b6001600160a01b0380821660008181526005602090815260408083208054600160801b6000196001600160401b0380841691909101811667ffffffffffffffff198416811783900482166001908101831690930277ffffffffffffffff0000000000000000ffffffffffffffff19909416179290921783558b86526004909452828520805460ff60e01b1942909316600160a01b026001600160e01b03199091169097179690961716600160e01b178555918901808452922080549194909116611e71576000548214611e7157805460208701516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038716171781555b5050604051869250600091506001600160a01b03841690600080516020613d3d833981519152908390a4505060018054810190555050565b612710811115611ed757604051630a4930ad60e31b8152612710600482015260248101829052604401610a96565b600a80546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b60408051606081018252600080825260208201819052918101919091528160005481101561203a57600081815260046020908152604091829020825160608101845290546001600160a01b0381168252600160a01b81046001600160401b031692820192909252600160e01b90910460ff161515918101829052906120385780516001600160a01b031615611fcf579392505050565b5060001901600081815260046020908152604091829020825160608101845290546001600160a01b038116808352600160a01b82046001600160401b031693830193909352600160e01b900460ff1615159281019290925215612033579392505050565b611fcf565b505b604051636f96cda160e11b815260040160405180910390fd5b6001600160a01b03811661208557604051630f7cac3760e21b81526001600160a01b0382166004820152602401610a96565b600f80546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b601054856000546120e09190613a96565b111561212e5760405162461bcd60e51b815260206004820152601860248201527f4e6f7420656e6f756768206d696e74656420746f6b656e7300000000000000006044820152606401610a96565b505050505050565b8060000361217a5734156121755760405162461bcd60e51b81526020600482015260066024820152652156616c756560d01b6044820152606401610a96565b6113f9565b6000612186828561381a565b9050600073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038516016121b857503481146121bc565b5034155b806121fd5760405162461bcd60e51b8152602060048201526011602482015270496e76616c6964206d73672076616c756560781b6044820152606401610a96565b60006001600160a01b038716156122145786612221565b600f546001600160a01b03165b905061222f85338386612887565b50505050505050565b6000546108cf83836128c8565b600060088054612254906137ba565b80601f0160208091040260200160405190810160405280929190818152602001828054612280906137ba565b80156122cd5780601f106122a2576101008083540402835291602001916122cd565b820191906000526020600020905b8154815290600101906020018083116122b057829003601f168201915b5050505050905081600890816122e391906138e1565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168183604051612315929190613c12565b60405180910390a15050565b61271081111561234f57604051630a4930ad60e31b8152612710600482015260248101829052604401610a96565b6040805180820182526001600160a01b0384811680835260208084018681526000898152600b8352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910160405180910390a3505050565b606061140d8383604051806060016040528060278152602001613d16602791396128e2565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a029061242e903390899088908890600401613c40565b6020604051808303816000875af1925050508015612469575060408051601f3d908101601f1916820190925261246691810190613c73565b60015b6124c7573d808015612497576040519150601f19603f3d011682016040523d82523d6000602084013e61249c565b606091505b5080516000036124bf576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b606060006124f2600c5490565b90506000600c80548060200260200160405190810160405280929190818152602001828054801561254257602002820191906000526020600020905b81548152602001906001019080831161252e575b5050505050905060005b8281101561264657818181518110612566576125666137ee565b602002602001015185101561263457600d600083838151811061258b5761258b6137ee565b6020026020010151815260200190815260200160002080546125ac906137ba565b80601f01602080910402602001604051908101604052809291908181526020018280546125d8906137ba565b80156126255780601f106125fa57610100808354040283529160200191612625565b820191906000526020600020905b81548152906001019060200180831161260857829003601f168201915b50505050509350505050919050565b61263f600182613a96565b905061254c565b506040516309797f6960e21b815260048101859052602401610a96565b6000828152601160205260409020610a2c82826138e1565b6000828152600e602052604090205460ff16156126ae57604051635d079ac960e11b815260048101839052602401610a96565b6000828152600d602052604090206126c682826138e1565b507f6bd5c950a8d8df17f772f5af37cb3655737899cbf903264b9795592da439661c6126f183612950565b604080519182526020820185905201612315565b600061270f611a9c565b61272c5760405163f409ec7360e01b815260040160405180910390fd5b8560000361274d57604051638fd36a9b60e01b815260040160405180910390fd5b60006010549050612795818888888080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612a4292505050565b6010919091559150807f2a0365091ef1a40953c670dce28177e37520648a6fdc91506bffac0ab045570d60016127cb8a84613a96565b6127d59190613c90565b888888886040516127ea959493929190613ca3565b60405180910390a25095945050505050565b6000808281805b878110156128785761281660028361381a565b9150600089898381811061282c5761282c6137ee565b905060200201359050808411612851576000848152602082905260409020935061286f565b6000818152602085905260409020935061286c600184613a96565b92505b50600101612803565b50941496939550929350505050565b80156113f95773eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038516016128bc576121758282612aa6565b6113f984848484612b2c565b610dd0828260405180602001604052806000815250612b7f565b6060600080856001600160a01b0316856040516128ff9190613cdc565b600060405180830381855af49150503d806000811461293a576040519150601f19603f3d011682016040523d82523d6000602084013e61293f565b606091505b509150915061156686838387612d22565b60008061295c600c5490565b90506000600c8054806020026020016040519081016040528092919081815260200182805480156129ac57602002820191906000526020600020905b815481526020019060010190808311612998575b5050505050905060005b82811015612a25578181815181106129d0576129d06137ee565b60200260200101518503612a1d578015612a1257816129f0600183613c90565b81518110612a0057612a006137ee565b60200260200101519350505050919050565b506000949350505050565b6001016129b6565b50604051630793127760e11b815260048101859052602401610a96565b600080612a4f8486613a96565b600c8054600181019091557fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7018190556000818152600d60205260409020909250829150612a9d84826138e1565b50935093915050565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612af3576040519150601f19603f3d011682016040523d82523d6000602084013e612af8565b606091505b5050905080610a2c57604051635fdc4ec160e11b81526001600160a01b038416600482015260248101839052604401610a96565b816001600160a01b0316836001600160a01b031603156113f957306001600160a01b03841603612b6a576121756001600160a01b0385168383612d9b565b6113f96001600160a01b038516848484612dfe565b6000546001600160a01b038416612ba857604051622e076360e81b815260040160405180910390fd5b82600003612bc95760405163b562e8dd60e01b815260040160405180910390fd5b6001600160a01b038416600081815260056020908152604080832080546fffffffffffffffffffffffffffffffff1981166001600160401b038083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b01811690920217909155858452600490925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b15612cdf575b60405182906001600160a01b03881690600090600080516020613d3d833981519152908290a4612ca860008784806001019550876123f9565b612cc5576040516368d2bf6b60e11b815260040160405180910390fd5b808210612c6f578260005414612cda57600080fd5b612d12565b5b6040516001830192906001600160a01b03881690600090600080516020613d3d833981519152908290a4808210612ce0575b5060009081556113f99085838684565b60608315612d91578251600003612d8a576001600160a01b0385163b612d8a5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a96565b50816124dd565b6124dd8383612e36565b6040516001600160a01b038316602482015260448101829052610a2c90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612e60565b6040516001600160a01b03808516602483015283166044820152606481018290526113f99085906323b872dd60e01b90608401612dc7565b815115612e465781518083602001fd5b8060405162461bcd60e51b8152600401610a9691906130c9565b6000612eb5826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612f329092919063ffffffff16565b805190915015610a2c5780806020019051810190612ed39190613cf8565b610a2c5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610a96565b60606124dd8484600085856001600160a01b0385163b612f945760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610a96565b600080866001600160a01b03168587604051612fb09190613cdc565b60006040518083038185875af1925050503d8060008114612fed576040519150601f19603f3d011682016040523d82523d6000602084013e612ff2565b606091505b509150915061300282828661300d565b979650505050505050565b6060831561301c57508161140d565b82511561302c5782518084602001fd5b8160405162461bcd60e51b8152600401610a9691906130c9565b6001600160e01b031981168114610a5f57600080fd5b60006020828403121561306e57600080fd5b813561140d81613046565b60005b8381101561309457818101518382015260200161307c565b50506000910152565b600081518084526130b5816020860160208601613079565b601f01601f19169290920160200192915050565b60208152600061140d602083018461309d565b6000602082840312156130ee57600080fd5b5035919050565b80356001600160a01b038116811461310c57600080fd5b919050565b6000806040838503121561312457600080fd5b61312d836130f5565b946020939093013593505050565b60006020828403121561314d57600080fd5b61140d826130f5565b60008060006060848603121561316b57600080fd5b613174846130f5565b9250613182602085016130f5565b9150604084013590509250925092565b600080604083850312156131a557600080fd5b50508035926020909101359150565b8015158114610a5f57600080fd5b600080604083850312156131d557600080fd5b82356001600160401b038111156131eb57600080fd5b830161010081860312156131fe57600080fd5b9150602083013561320e816131b4565b809150509250929050565b60006080828403121561322b57600080fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171561326f5761326f613231565b604052919050565b60006001600160401b0382111561329057613290613231565b50601f01601f191660200190565b60006132b16132ac84613277565b613247565b90508281528383830111156132c557600080fd5b828260208301376000602084830101529392505050565b600082601f8301126132ed57600080fd5b61140d8383356020850161329e565b60008060008060008060c0878903121561331557600080fd5b61331e876130f5565b955060208701359450613333604088016130f5565b93506060870135925060808701356001600160401b038082111561335657600080fd5b6133628a838b01613219565b935060a089013591508082111561337857600080fd5b5061338589828a016132dc565b9150509295509295509295565b6000602082840312156133a457600080fd5b81356001600160401b038111156133ba57600080fd5b8201601f810184136133cb57600080fd5b6124dd8482356020840161329e565b6000806000606084860312156133ef57600080fd5b83359250613182602085016130f5565b60008083601f84011261341157600080fd5b5081356001600160401b0381111561342857600080fd5b60208301915083602082850101111561344057600080fd5b9250929050565b60008060006040848603121561345c57600080fd5b8335925060208401356001600160401b0381111561347957600080fd5b613485868287016133ff565b9497909650939450505050565b600080604083850312156134a557600080fd5b6131fe836130f5565b600080602083850312156134c157600080fd5b82356001600160401b03808211156134d857600080fd5b818501915085601f8301126134ec57600080fd5b8135818111156134fb57600080fd5b8660208260051b850101111561351057600080fd5b60209290920196919550909350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b8281101561357957603f1988860301845261356785835161309d565b9450928501929085019060010161354b565b5092979650505050505050565b6000806000806080858703121561359c57600080fd5b6135a5856130f5565b93506135b3602086016130f5565b92506040850135915060608501356001600160401b038111156135d557600080fd5b6135e1878288016132dc565b91505092959194509250565b60008060008060006060868803121561360557600080fd5b8535945060208601356001600160401b038082111561362357600080fd5b61362f89838a016133ff565b9096509450604088013591508082111561364857600080fd5b50613655888289016133ff565b969995985093965092949392505050565b60006101008a83528960208401528860408401528760608401528660808401528560a084015260018060a01b03851660c08401528060e08401526136ac8184018561309d565b9b9a5050505050505050505050565b6000806000604084860312156136d057600080fd5b83356001600160401b03808211156136e757600080fd5b6136f3878388016132dc565b9450602086013591508082111561370957600080fd5b50613485868287016133ff565b6000806040838503121561372957600080fd5b613732836130f5565b9150613740602084016130f5565b90509250929050565b600080600080600060a0868803121561376157600080fd5b61376a866130f5565b94506020860135935061377f604087016130f5565b92506060860135915060808601356001600160401b038111156137a157600080fd5b6137ad88828901613219565b9150509295509295909350565b600181811c908216806137ce57607f821691505b60208210810361322b57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176108cf576108cf613804565b60008261384e57634e487b7160e01b600052601260045260246000fd5b500490565b6000808335601e1984360301811261386a57600080fd5b8301803591506001600160401b0382111561388457600080fd5b60200191503681900382131561344057600080fd5b601f821115610a2c576000816000526020600020601f850160051c810160208610156138c25750805b601f850160051c820191505b8181101561212e578281556001016138ce565b81516001600160401b038111156138fa576138fa613231565b61390e8161390884546137ba565b84613899565b602080601f831160018114613943576000841561392b5750858301515b600019600386901b1c1916600185901b17855561212e565b600085815260208120601f198616915b8281101561397257888601518255948401946001909101908401613953565b50858210156139905787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60408152823560408201526020830135606082015260408301356080820152606083013560a0820152608083013560c082015260a083013560e08201526000613a1460c085016130f5565b6001600160a01b03166101008381019190915260e08501359036869003601e19018212613a4057600080fd5b602091860191820191356001600160401b03811115613a5e57600080fd5b803603831315613a6d57600080fd5b81610120860152613a83610140860182856139a0565b935050505061140d602083018415159052565b808201808211156108cf576108cf613804565b60008060408385031215613abc57600080fd5b82516001600160401b03811115613ad257600080fd5b8301601f81018513613ae357600080fd5b8051613af16132ac82613277565b818152866020838501011115613b0657600080fd5b613b17826020830160208601613079565b60209590950151949694955050505050565b60008551613b3b818460208a01613079565b820184868237909301918252506020019392505050565b8284823760609190911b6001600160601b0319169101908152601401919050565b60008060408385031215613b8657600080fd5b82356001600160401b03811115613b9c57600080fd5b613ba8858286016132dc565b95602094909401359450505050565b82848237909101908152602001919050565b6000808335601e19843603018112613be057600080fd5b8301803591506001600160401b03821115613bfa57600080fd5b6020019150600581901b360382131561344057600080fd5b604081526000613c25604083018561309d565b8281036020840152613c37818561309d565b95945050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906115669083018461309d565b600060208284031215613c8557600080fd5b815161140d81613046565b818103818111156108cf576108cf613804565b858152606060208201526000613cbd6060830186886139a0565b8281036040840152613cd08185876139a0565b98975050505050505050565b60008251613cee818460208701613079565b9190910192915050565b600060208284031215613d0a57600080fd5b815161140d816131b456fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa26469706673582212207ead92dd017670971eeac5f9fec906766aad3fb44495598795f46c6c6d0a1f2864736f6c63430008180033",
  linkReferences: {},
  deployedLinkReferences: {},
};
