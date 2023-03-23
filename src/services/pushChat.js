import * as PushAPI from "@pushprotocol/restapi";

const env = "staging";

export const createUser = async (address) => {
  const user = await PushAPI.user.create({
    account: address,
    env,
  });

  return user;
};

export const getUser = async (address) => {
  const user = await PushAPI.user.get({
    account: `eip155:${address}`,
    env,
  });

  return user;
};

export const getPgpDecrptedKey = async (_signer) => {
  const address = await _signer.getAddress();
  const user = await getUser(address);

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
  });

  return pgpDecryptedPvtKey;
};

export const getChats = async (_signer, type) => {
  const address = await _signer.getAddress();
  const user = await getUser(address);

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
  });

  const chats = await PushAPI.chat[type]({
    account: `eip155:${address}`,
    toDecrypt: false,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env,
  });

  return chats;
};

export const sendChat = async (receiverAddress, message, _signer) => {
  const address = await _signer.getAddress();
  const user = await getUser(address);

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
  });

  const response = await PushAPI.chat.send({
    messageContent: message,
    messageType: "Text", // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: receiverAddress.includes("0x")
      ? `eip155:${receiverAddress}`
      : receiverAddress,
    signer: _signer,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env,
  });

  return response;
};

export const approveChat = async (account, senderAddress) => {
  const response = await PushAPI.chat.approve({
    status: "Approved",
    account,
    senderAddress, // receiver's address or chatId of a group
    env,
  });

  return response;
};

export const createGroup = async (_signer, groupOptions) => {
  const address = await _signer.getAddress();
  const user = await getUser(address);

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
  });

  const response = await PushAPI.chat.createGroup({
    ...groupOptions,
    members: [],
    admins: [],
    isPublic: true,
    account: address,
    env: "staging",
    pgpPrivateKey: pgpDecryptedPvtKey,
  });

  return response;
};

export const updateGroup = async (_signer, groupOptions) => {
  const address = await _signer.getAddress();
  const user = await getUser(address);

  const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: _signer,
  });

  const response = await PushAPI.chat.updateGroup({
    ...groupOptions,
    admins: [address],
    account: address,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env,
  });

  return response;
};
