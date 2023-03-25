import { ethers, Wallet } from "ethers";
import { ATTESTATION_ABI, ATTESTATION_CONTRACT_ADDRESS } from "../utils";

export const getSigner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    // signer.
    return signer;
  }

  return null;
};

export const getConnectedAccount = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      return provider.getSigner();
    }

    return null;
  }

  return null;
};

export const attest = async (attestation, signer) => {
  const contract = new ethers.Contract(
    ATTESTATION_CONTRACT_ADDRESS,
    ATTESTATION_ABI,
    signer
  );

  const _attestation = {
    about: attestation.about,
    key: encodeRawKey(attestation.key),
    val: ethers.utils.toUtf8Bytes(attestation.value), // for true
  };

  const response = await contract.attest([_attestation]);

  return response;
};

export const encodeRawKey = (rawKey) => {
  if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
  return hash.slice(0, 64) + "ff";
};
