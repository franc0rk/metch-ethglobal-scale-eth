import {
  approveChat,
  createGroup,
  createUser,
  getChats,
  getPgpDecrptedKey,
  getUser,
  sendChat,
  updateGroup,
} from "../services/pushChat";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { useState, useEffect } from "react";

export default function ChatFunctions({ signer }) {
  const initSocket = async () => {
    const pushSDKSocket = createSocketConnection({
      user: `eip155:${address}`,
      env: "staging",
      socketType: "chat",
      socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    });

    pushSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log("connected");
    });
    pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => console.log(err));
    pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) =>
      console.log(message)
    );
    pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) =>
      console.log(notification)
    );
    pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam));
  };

  async function fetchChats() {
    const _chats = await getChats(signer, "chats");
    const _requests = await getChats(signer, "requests");
    setChats(_chats);
    setRequests(_requests);
    console.log(_chats, _requests);
  }

  async function handleApprove(chatRequest) {
    const senderAddress = chatRequest.did.replace("eip155:", "");
    approveChat(address, senderAddress);
  }

  useEffect(() => {
    getAddress();

    async function getAddress() {
      const _address = await signer.getAddress();
      setAddress(_address);
    }
  }, [signer]);

  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [receiverAddress, setReceiverAddress] = useState("");

  return (
    <div className="p-4">
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => createUser(address)}
      >
        Create User
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => getUser(address)}
      >
        Get User
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => getPgpDecrptedKey(signer)}
      >
        Get pgpKey
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => fetchChats(signer, "chats")}
      >
        Get Chats
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => initSocket()}
      >
        Init Socket
      </button>
      <input
        className="border border-gray-400 p-2 mr-2"
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
        placeholder="Enter reiciver address"
      />
      <input
        className="border border-gray-400 p-2 mr-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => sendChat(receiverAddress, message, signer)}
        disabled={!message}
      >
        Send Chat
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => createGroup(signer)}
      >
        Create Group
      </button>
      <button
        className="p-2 border border-gray-500 rounded mr-2"
        onClick={() => updateGroup(signer)}
      >
        Update Group
      </button>
      <div className="flex flex-wrap mt-4">
        <div className="w-1/2 p-4">
          <h2 className="text-xl border-b border-b-purple-400">Chats</h2>
          {chats.map((chat, chatIndex) => (
            <div className="w-full my-2" key={chatIndex}>
              <p className="font-semibold">
                {chat.did || chat.groupInformation?.groupName}
              </p>
              <p>{chat.msg.messageContent}</p>
            </div>
          ))}
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-xl border-b border-b-purple-400">Requests</h2>
          {requests.map((request, requestIndex) => (
            <div className="w-full my-2" key={requestIndex}>
              <p className="font-semibold">{request.did}</p>
              <p>{request.msg.messageContent}</p>
              <button
                className="bg-purple-900 text-white p-2"
                onClick={() => handleApprove(request)}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
