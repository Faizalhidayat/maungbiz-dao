import type { Abi } from "viem"

export const maungDaoAbi = [
  // =========================
  // READ FUNCTIONS
  // =========================

  {
    type: "function",
    name: "proposalCount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" }
    ]
  },

  {
    type: "function",
    name: "getTreasuryBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "", type: "uint256" }
    ]
  },

  {
    type: "function",
    name: "getProposal",
    stateMutability: "view",
    inputs: [
      { name: "_id", type: "uint256" }
    ],
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "proposer", type: "address" },
          { name: "name", type: "string" },
          { name: "category", type: "string" },
          { name: "description", type: "string" },
          { name: "requestedAmount", type: "uint256" },
          { name: "jobs", type: "uint256" },
          { name: "yesVotes", type: "uint256" },
          { name: "noVotes", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "fundsReleased", type: "bool" }
        ],
        name: "",
        type: "tuple"
      }
    ]
  },

  // =========================
  // WRITE FUNCTIONS
  // =========================

  {
    type: "function",
    name: "createFundingProposal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_category", type: "string" },
      { name: "_description", type: "string" },
      { name: "_requestedAmount", type: "uint256" },
      { name: "_jobs", type: "uint256" }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_id", type: "uint256" },
      { name: "_support", type: "bool" }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "finalizeProposal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_id", type: "uint256" }
    ],
    outputs: []
  },

  {
    type: "function",
    name: "releaseFunds",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_id", type: "uint256" }
    ],
    outputs: []
  },

  // =========================
  // EVENTS
  // =========================

  {
    type: "event",
    name: "ProposalCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "proposer", type: "address", indexed: true },
      { name: "requestedAmount", type: "uint256", indexed: false }
    ],
    anonymous: false
  },

  {
    type: "event",
    name: "Voted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "voter", type: "address", indexed: true },
      { name: "support", type: "bool", indexed: false }
    ],
    anonymous: false
  },

  {
    type: "event",
    name: "ProposalApproved",
    inputs: [
      { name: "id", type: "uint256", indexed: true }
    ],
    anonymous: false
  },

  {
    type: "event",
    name: "ProposalRejected",
    inputs: [
      { name: "id", type: "uint256", indexed: true }
    ],
    anonymous: false
  },

  {
    type: "event",
    name: "FundsReleased",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
    anonymous: false
  }

] as const satisfies Abi
