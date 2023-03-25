export const DEFAULT_IMAGE_URL =
  "https://gateway.pinata.cloud/ipfs/QmR7CvV4tPQ2bR8e369rCQDy4sEVGHJWjMf4Q1X88yamQU";

export const getPublicationAttribute = (idea, attribute, defaultValue) => {
  if (idea.metadata.attributes) {
    const attr = idea.metadata.attributes.find(
      (_attr) => _attr.traitType === attribute
    );

    return attr ? attr.value : defaultValue;
  }

  return defaultValue;
};

export const CALENDAR_EVENTS = [
  {
    name: "ZK Polygon Day",
    date: "Mar 27, 2023",
    image:
      "https://storage.googleapis.com/ethglobal-api-production/events/i4sra/logo/1679027449746_9McrmY41_400x400.jpg",
  },
  {
    name: "Pragma Tokyo",
    date: "Apr 13, 2023",
    image:
      "https://storage.googleapis.com/ethglobal-api-production/events/j2h4t/logo/1678302376194_Frame%201%20(1).jpg",
  },
  {
    name: "ETHGlobal Tokyo",
    date: "Apr 14 2023 - Apr 16 2023",
    image:
      "https://storage.googleapis.com/ethglobal-api-production/events/eoapw/logo/1674814040584_Group%202.jpg",
  },
  {
    name: "ETHGlobal Lisbon",
    date: "May 12 2023 - May 14 2023",
    image:
      "https://storage.googleapis.com/ethglobal-api-production/events/jk6dg/logo/1678468809847_lisbon-circle%20(1).png",
  },
];

export const ATTESTATION_CONTRACT_ADDRESS =
  "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";

export const ATTESTATION_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "about",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "key",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "val",
        type: "bytes",
      },
    ],
    name: "AttestationCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "about", type: "address" },
          { internalType: "bytes32", name: "key", type: "bytes32" },
          { internalType: "bytes", name: "val", type: "bytes" },
        ],
        internalType: "struct AttestationStation.AttestationData[]",
        name: "_attestations",
        type: "tuple[]",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "bytes32", name: "", type: "bytes32" },
    ],
    name: "attestations",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
