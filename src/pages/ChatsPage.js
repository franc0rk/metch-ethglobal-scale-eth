import { useState, useEffect } from "react";
import { getChats } from "../services/pushChat";
import { keyBy } from "lodash";
import { getMetchProfiles } from "../services/lensQueries";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function ChatsPage({ signer, address }) {
  const [requests, setRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  function mapRequests(_requests, _keyedProfiles) {
    const mappedRequests = _requests.map((_request) => {
      return {
        ..._request,
        profile: _keyedProfiles[_request.did.replace("eip155:", "")],
      };
    });
    return mappedRequests;
  }

  function mapProfiles(_profiles) {
    const filteredProfiles = _profiles.filter(
      (_profile) =>
        _profile.attributes &&
        _profile.attributes.some((attr) => attr.value === "metch") &&
        _profile.ownedBy !== address
    );

    const mappedProfiles = filteredProfiles.map((_profile) => {
      const keyedAttributes = keyBy(_profile.attributes, "key");
      return {
        address: _profile.ownedBy,
        name: _profile.name,
        bio: _profile.bio,
        imageUrl: _profile.picture
          ? _profile.picture.original.url
          : "https://gateway.pinata.cloud/ipfs/QmR7CvV4tPQ2bR8e369rCQDy4sEVGHJWjMf4Q1X88yamQU",
        status: keyedAttributes["status"]
          ? keyedAttributes["status"].value
          : "Inactive",
        location: keyedAttributes["location"]
          ? keyedAttributes["location"].value
          : "",
        role: keyedAttributes["role"]
          ? keyedAttributes["role"].value
          : "No role",
        github: keyedAttributes["github"]
          ? keyedAttributes["github"].value
          : "",
        twitter: keyedAttributes["twitter"]
          ? keyedAttributes["twitter"].value
          : "",
        discord: keyedAttributes["discord"]
          ? keyedAttributes["discord"].value
          : "",
        experience: keyedAttributes["experience"]
          ? keyedAttributes["experience"].value
          : "No experience",
        interests: keyedAttributes["interests"]
          ? keyedAttributes["interests"].value
          : "-",
      };
    });

    return mappedProfiles;
  }

  function mapChats(_chats) {
    const filteredChats = _chats.filter((_chat) => _chat.groupInformation);

    const mappedProfiles = filteredChats;
    return mappedProfiles;
  }

  async function fetchRequests() {
    const _requests = await getChats(signer, "requests");

    const _profiles = await getMetchProfiles();
    const mappedProfiles = mapProfiles(_profiles);
    const keyedProfiles = keyBy(mappedProfiles, "address");
    const mappedRequests = mapRequests(_requests, keyedProfiles);
    setRequests(mappedRequests);
  }

  async function fetchChats() {
    const _chats = await getChats(signer, "chats");

    const mappedChats = mapChats(_chats);

    setChats(mappedChats);
  }

  useEffect(() => {
    // fetchRequests();
    fetchChats();
  }, []);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <div>
          <h4 className="text-purple-500 mb-2">Requests</h4>
          <div className="flex flex-wrap">
            {requests.map((request, requestIndex) => (
              <div
                className="flex justify-center items-center mb-2 cursor-pointer mr-2"
                key={`request-${requestIndex}`}
              >
                <img
                  className="border-2 border-gray-300  w-16 h-16 rounded-full"
                  src={request.profile?.imageUrl}
                  alt={request.profile?.name}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="my-4">
          <h4 className="text-purple-500 mb-2">Chats</h4>
          <div>
            {chats.map((chat, chatIndex) => (
              <div
                className="flex flex-wrap border-b border-b-gray-300 py-2 cursor-pointer"
                key={`chat-${chatIndex}`}
                onClick={() =>
                  navigate(`/chat/${chat.groupInformation.chatId}`, {
                    state: chat.groupInformation,
                  })
                }
              >
                <div>
                  <img
                    className="w-16 h-16 border-2 border-gray-300 rounded-full"
                    src={chat.groupInformation.groupImage}
                    alt="group"
                  />
                </div>
                <div className="ml-4">
                  <h6 className="font-semibold mb-1 text-gray-500">
                    {chat.groupInformation.groupName}
                  </h6>
                  <p className="text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {chat.msg.messageContent || "No messages yet."}
                  </p>
                  <small className="text-gray-400">
                    {moment(chat.msg.timestamp).format("YYYY-MM-DD HH:mm")}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
