import LensClient, { mumbai, PublicationTypes } from "@lens-protocol/client";
import axios from "axios";
import { v4 } from "uuid";

const lensClient = new LensClient({
  environment: mumbai,
});

const authenticate = async (signer) => {
  const address = await signer.getAddress();

  const challengeInfo = await lensClient.authentication.generateChallenge(
    address
  );

  const signature = await signer.signMessage(challengeInfo);

  await lensClient.authentication.authenticate(address, signature);

  const isAuthenticated = await lensClient.authentication.isAuthenticated();

  return isAuthenticated;
};

export const setProfileMetadata = async (profileId, metadata, signer) => {
  console.log(metadata);
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

    await lensClient.transaction.waitForIsIndexed(broadcastResult.value.txId);

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

    await lensClient.transaction.waitForIsIndexed(broadcastResult.value.txId);

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

    await lensClient.transaction.waitForIsIndexed(broadcastResult.value.txId);

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

    await lensClient.transaction.waitForIsIndexed(
      profileCreateResultValue.txId
    );

    return profileCreateResultValue;
  }
};

export const getProfilesByAddress = async (address) => {
  const profiles = await lensClient.profile.fetchAll({
    ownedBy: [address],
  });

  return profiles.items;
};

const searchQuery = {
  query: "metch,tprofile112",
  limit: 50,
};

export const getMetchProfiles = async () => {
  const profilesByHandle = await lensClient.search.profiles(searchQuery);

  return profilesByHandle.items;
};

export const getPublications = async (publicationTypes) => {
  const metchProfiles = await getMetchProfiles();
  const profileIds = metchProfiles.map((profile) => profile.id);

  const publications = await lensClient.publication.fetchAll({
    profileIds,
    publicationTypes,
  });

  return publications.items;
};

export const commentPublication = async (
  publicationId,
  profileId,
  chatGroupId,
  comment,
  signer
) => {
  const isAuthenticated = await authenticate(signer);

  if (isAuthenticated) {
    const metadata = {
      appId: "metch",
      attributes: [
        {
          displayType: "string",
          traitType: "comment",
          value: comment,
        },
        {
          displayType: "string",
          traitType: "chatId",
          value: chatGroupId,
        },
      ],
      content: comment,
      description: comment,
      locale: "en-US",
      mainContentFocus: "TEXT_ONLY",
      metadata_id: v4(),
      name: comment,
      tags: ["metch-comment"],
      version: "2.0.0",
    };

    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYzRkOWUyOS0wMGUxLTQ3ZDktOThhYi01MjA5ZTg4NjdhNWIiLCJlbWFpbCI6ImZyYW5jb2RlbGVvbjk3QGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVmZGRkOGY2MzlmYTNiN2I0YjZiIiwic2NvcGVkS2V5U2VjcmV0IjoiNTk4NzM2MDg1MWUzZTA4NmZjNTQ1NzM1NjdiZDY4YjhmNjE0OGNmMGIxOWIzMWE4YjBjMGQxNDM1MTQ4ZWYwNCIsImlhdCI6MTY3ODY3ODUwN30.iLdHjj4ArYYCX7EfyJegCO0exu6ZglV6ICgnlccSpHA",
      },
      data: metadata,
    };

    const { data } = await axios(config);

    const contentURI = `ipfs://${data.IpfsHash}`;

    const validateResult = await lensClient.publication.validateMetadata(
      metadata
    );
    console.log(contentURI, profileId, validateResult);
    if (validateResult.valid) {
      const typedDataResult =
        await lensClient.publication.createCommentTypedData({
          publicationId,
          profileId,
          contentURI,
          collectModule: {
            revertCollectModule: true, // collect disabled
          },
          referenceModule: {
            followerOnlyReferenceModule: false, // anybody can comment or mirror
          },
        });

      const data = typedDataResult.unwrap();

      const signedTypedData = await signer._signTypedData(
        data.typedData.domain,
        data.typedData.types,
        data.typedData.value
      );

      const broadcastResult = await lensClient.transaction.broadcast({
        id: data.id,
        signature: signedTypedData,
      });

      await lensClient.transaction.waitForIsIndexed(broadcastResult.value.txId);

      return broadcastResult;
    }
  }
};

export const createPublication = async (signer, profileId, metadata) => {
  const isAuthenticated = await authenticate(signer);

  if (isAuthenticated) {
    var config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhYzRkOWUyOS0wMGUxLTQ3ZDktOThhYi01MjA5ZTg4NjdhNWIiLCJlbWFpbCI6ImZyYW5jb2RlbGVvbjk3QGhvdG1haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVmZGRkOGY2MzlmYTNiN2I0YjZiIiwic2NvcGVkS2V5U2VjcmV0IjoiNTk4NzM2MDg1MWUzZTA4NmZjNTQ1NzM1NjdiZDY4YjhmNjE0OGNmMGIxOWIzMWE4YjBjMGQxNDM1MTQ4ZWYwNCIsImlhdCI6MTY3ODY3ODUwN30.iLdHjj4ArYYCX7EfyJegCO0exu6ZglV6ICgnlccSpHA",
      },
      data: metadata,
    };

    const { data } = await axios(config);

    const contentURI = `ipfs://${data.IpfsHash}`;

    const validateResult = await lensClient.publication.validateMetadata(
      metadata
    );
    console.log(contentURI, profileId, validateResult);
    if (validateResult.valid) {
      const typedDataResult = await lensClient.publication.createPostTypedData({
        profileId,
        contentURI,
        collectModule: {
          revertCollectModule: true, // collect disabled
        },
        referenceModule: {
          followerOnlyReferenceModule: false, // anybody can comment or mirror
        },
      });

      const data = typedDataResult.unwrap();

      const signedTypedData = await signer._signTypedData(
        data.typedData.domain,
        data.typedData.types,
        data.typedData.value
      );

      const broadcastResult = await lensClient.transaction.broadcast({
        id: data.id,
        signature: signedTypedData,
      });

      await lensClient.transaction.waitForIsIndexed(broadcastResult.value.txId);

      return broadcastResult;
    }
  }
};
