import { useState, useEffect } from "react";
import { getHistory, sendChat } from "../services/pushChat";
import { keyBy } from "lodash";
import { getMetchProfiles } from "../services/lensQueries";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EVENTS } from "@pushprotocol/socket";
// import moment from "moment";

export default function ChatPage({ signer, address, socket }) {
  const [chatInfo, setChatInfo] = useState({});
  const [chatHistoryMessages, setChatHistoryMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyedProfiles, setKeyedProfiles] = useState([]);
  const [isViewingInfo, setIsViewingInfo] = useState(false);

  const navigate = useNavigate();
  const routerLocation = useLocation();
  const params = useParams();

  function mapProfiles(_profiles) {
    const filteredProfiles = _profiles.filter(
      (_profile) =>
        _profile.attributes &&
        _profile.attributes.some((attr) => attr.value === "metch")
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

  function mapMessages(_messages, _keyedProfiles) {
    return _messages.map((_message) => ({
      ..._message,
      profile: _keyedProfiles[_message.fromDID.replace("eip155:", "")],
    }));
  }

  async function fetchChatInfo() {
    setChatInfo(routerLocation.state);
  }

  async function fetchHistory() {
    const history = await getHistory(params.id, signer);
    const profiles = await getMetchProfiles();
    const mappedProfiles = mapProfiles(profiles);
    const _keyedProfiles = keyBy(mappedProfiles, "address");
    setKeyedProfiles(_keyedProfiles);
    const messages = mapMessages(history, _keyedProfiles).reverse();
    setChatHistoryMessages(messages);
  }

  async function sendMessage() {
    const message = await sendChat(params.id, newMessage, signer);
    setChatHistoryMessages([
      ...chatHistoryMessages,
      { ...message, profile: keyedProfiles[address] },
    ]);
    setNewMessage("");
  }

  useEffect(() => {
    fetchChatInfo();
    fetchHistory();
    socket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
      if (message.toDID === params.id) {
        setChatHistoryMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            profile: keyedProfiles[message.fromDID.replace("eip155:", "")],
          },
        ]);
      }
    });
  }, []);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <div className="relative border-2 border-gray-300 rounded-lg mh-chat-card">
          <div className="bg-gray-300 p-4">
            <div className="flex">
              {!isViewingInfo && (
                <button className="mr-2" onClick={() => navigate("/chats")}>
                  ⬅️
                </button>
              )}
              <h4 className="flex-1 text-gray-600">{chatInfo.groupName}</h4>
              <button onClick={() => setIsViewingInfo(!isViewingInfo)}>
                {isViewingInfo ? "\u00D7" : "ℹ️"}
              </button>
            </div>
          </div>
          {!isViewingInfo && (
            <div>
              <div className="p-4 flex flex-col">
                {chatHistoryMessages.map((message, messageIndex) => (
                  <div
                    className={`border border-gray-300 p-1 w-40 rounded-lg mb-2 text-white ${
                      keyedProfiles[message.fromDID.replace("eip155:", "")]
                        ?.address === address
                        ? "bg-purple-500 self-end"
                        : "bg-gray-400 self-start"
                    }`}
                    key={`message-${messageIndex}`}
                  >
                    <div className="flex flex-wrap justify-start items-start text-xs">
                      <div className="w-1/4">
                        <img
                          className="rounded-full w-8 h-8"
                          src={
                            keyedProfiles[
                              message.fromDID.replace("eip155:", "")
                            ]
                              ? keyedProfiles[
                                  message.fromDID.replace("eip155:", "")
                                ].imageUrl
                              : "/metch-logo.png"
                          }
                        />
                      </div>
                      <div className="w-3/4">
                        <div>
                          {keyedProfiles[message.fromDID.replace("eip155:", "")]
                            ? keyedProfiles[
                                message.fromDID.replace("eip155:", "")
                              ].name
                            : message.fromDID
                                .replace("eip155:", "")
                                .substr(0, 8) + "..."}
                        </div>
                        <div>{message.messageContent}</div>
                      </div>
                      {/* <div className="opacity-80">{moment().format("HH:mm")}</div> */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute w-full bottom-0">
                <div className="relative">
                  <div className="border border-gray-300"></div>
                  <input
                    className="w-full p-2 border-t-gray-300 rounded-lg focus:outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter message"
                  />
                  <button
                    className="absolute right-2 bottom-2 text-purple-500"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
          {isViewingInfo && (
            <div className="p-2">
              <div>
                <div className="text-gray-500">Description</div>
                <div className="text-gray-500 text-sm">
                  {chatInfo.groupDescription}
                </div>
              </div>
              <div className="my-8">
                <div className="text-gray-500 mb-2">
                  Members ({chatInfo.members.length})
                </div>
                <div className="text-gray-500 text-sm">
                  <div>
                    {chatInfo.members.map((member, memberIndex) => (
                      <div
                        className="flex items-center my-2"
                        key={`member-${memberIndex}`}
                      >
                        <div>
                          <img
                            className="w-16 h-16 rounded-full border-2 border-gray-300"
                            src={
                              keyedProfiles[
                                member.wallet.replace("eip155:", "")
                              ]
                                ? keyedProfiles[
                                    member.wallet.replace("eip155:", "")
                                  ].imageUrl
                                : "/metch-logo.png"
                            }
                          />
                        </div>
                        <div className="px-2">
                          <p>
                            {keyedProfiles[member.wallet.replace("eip155:", "")]
                              ? keyedProfiles[
                                  member.wallet.replace("eip155:", "")
                                ].name + " "
                              : member.wallet
                                  .replace("eip155:", "")
                                  .substr(0, 16) + "... "}
                            <button className="cursor-pointer text-purple-500 underline">
                              Send POH
                            </button>
                          </p>
                          <p>
                            {keyedProfiles[member.wallet.replace("eip155:", "")]
                              ? keyedProfiles[
                                  member.wallet.replace("eip155:", "")
                                ].role
                              : "No role"}
                          </p>
                          {member.isAdmin && <p>Admin</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="my-8">
                <div className="text-gray-500 mb-2">Group Image</div>
                <div className="text-gray-500 text-sm">
                  <img
                    className="w-full rounded-lg border-2 border-gray-300"
                    src={chatInfo.groupImage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
