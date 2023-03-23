export const DEFAULT_IMAGE_URL =
  "https://gateway.pinata.cloud/ipfs/QmR7CvV4tPQ2bR8e369rCQDy4sEVGHJWjMf4Q1X88yamQU";

export const getIdeaAttribute = (idea, attribute, defaultValue) => {
  if (idea.metadata.attributes) {
    const attr = idea.metadata.attributes.find(
      (_attr) => _attr.traitType === attribute
    );

    return attr ? attr.value : defaultValue;
  }

  return defaultValue;
};
