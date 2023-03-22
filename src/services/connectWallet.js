import { ethers } from "ethers";

export const getSigner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

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
