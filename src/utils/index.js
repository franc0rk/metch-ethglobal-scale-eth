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
