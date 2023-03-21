import { createClient } from "urql";
import LensClient, { mumbai } from "@lens-protocol/client";

const client = createClient({
  url: "https://api-mumbai.lens.dev",
});

const lensClient = new LensClient({
  environment: mumbai,
});

export const setProfileMetadata = async (profileId, metadata, signer) => {
  const address = await signer.getAddress();

  const challengeInfo = await lensClient.authentication.generateChallenge(
    address
  );
  const signature = await signer.signMessage(challengeInfo);

  await lensClient.authentication.authenticate(address, signature);

  const isAuthenticated = await lensClient.authentication.isAuthenticated();

  if (isAuthenticated) {
    const profileTypedData =
      await lensClient.profile.createSetProfileMetadataTypedData({
        profileId,
        metadata,
      });

    const typedData = profileTypedData.unwrap().typedData;
    const signedTypedData = await signer._signTypedData(
      typedData.domain,
      typedData.types,
      typedData.value
    );

    const broadcastResult = await lensClient.transaction.broadcast({
      id: profileTypedData.value.id,
      signature: signedTypedData,
    });

    return broadcastResult;
  }
};

export const setProfileImage = async (profileId, url, signer) => {
  const address = await signer.getAddress();

  const challengeInfo = await lensClient.authentication.generateChallenge(
    address
  );
  const signature = await signer.signMessage(challengeInfo);

  await lensClient.authentication.authenticate(address, signature);

  const isAuthenticated = await lensClient.authentication.isAuthenticated();

  if (isAuthenticated) {
    const profileTypedData =
      await lensClient.profile.createSetProfileImageURITypedData({
        profileId,
        url,
      });

    const typedData = profileTypedData.unwrap().typedData;
    const signedTypedData = await signer._signTypedData(
      typedData.domain,
      typedData.types,
      typedData.value
    );

    const broadcastResult = await lensClient.transaction.broadcast({
      id: profileTypedData.value.id,
      signature: signedTypedData,
    });

    return broadcastResult;
  }
};

export const setNewProfileMetadata = async (profileId, signer) => {
  const address = await signer.getAddress();

  const challengeInfo = await lensClient.authentication.generateChallenge(
    address
  );
  const signature = await signer.signMessage(challengeInfo);

  await lensClient.authentication.authenticate(address, signature);

  const isAuthenticated = await lensClient.authentication.isAuthenticated();

  if (isAuthenticated) {
    const profileTypedData =
      await lensClient.profile.createSetProfileMetadataTypedData({
        profileId,
        metadata:
          "ipfs://bafkreig3knqnyageec435abixi7kfjtbj4e7k3h25fajufa6zlfngfp7fe",
      });

    const typedData = profileTypedData.unwrap().typedData;
    const signedTypedData = await signer._signTypedData(
      typedData.domain,
      typedData.types,
      typedData.value
    );

    const broadcastResult = await lensClient.transaction.broadcast({
      id: profileTypedData.value.id,
      signature: signedTypedData,
    });

    return broadcastResult;
  }
};

export const createLensProfile = async (signer, handle) => {
  const address = await signer.getAddress();

  const challengeInfo = await lensClient.authentication.generateChallenge(
    address
  );

  const signature = await signer.signMessage(challengeInfo);

  await lensClient.authentication.authenticate(address, signature);

  const isAuthenticated = await lensClient.authentication.isAuthenticated();

  if (isAuthenticated) {
    const profileCreateResult = await lensClient.profile.create({
      handle,
    });

    const profileCreateResultValue = profileCreateResult.unwrap();

    if ("txId" in profileCreateResultValue) {
      console.log(
        `Transaction was successfuly broadcasted with txId ${profileCreateResultValue.txId}`
      );

      return profileCreateResultValue;
    }
  }
};

export const getProfiles = async (address) => {
  const query = `query Profiles {
    profiles(request: { ownedBy: ["${address}"], limit: 10 }) {
    items {
        id
        name
        bio
        attributes {
        displayType
        traitType
        key
        value
        }
        followNftAddress
        metadata
        isDefault
        picture {
        ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
        }
        ... on MediaSet {
            original {
            url
            mimeType
            }
        }
        __typename
        }
        handle
        coverPicture {
        ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
        }
        ... on MediaSet {
            original {
            url
            mimeType
            }
        }
        __typename
        }
        ownedBy
        dispatcher {
        address
        canUseRelay
        }
        stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
        }
        followModule {
        ... on FeeFollowModuleSettings {
            type
            amount {
            asset {
                symbol
                name
                decimals
                address
            }
            value
            }
            recipient
        }
        ... on ProfileFollowModuleSettings {
        type
        }
        ... on RevertFollowModuleSettings {
        type
        }
        }
    }
    pageInfo {
        prev
        next
        totalCount
    }
    }
    }`;
  const result = await client.query(query).toPromise();

  return result.data.profiles.items;
};
