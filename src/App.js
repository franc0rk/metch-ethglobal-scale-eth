import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getConnectedAccount, getSigner } from "./services/connectWallet";
import AppHeader from "./components/AppHeader";
import FooterMenu from "./components/FooterMenu";
import MatcherPage from "./pages/MatcherPage";
import { getHistory, getUser } from "./services/pushChat";
import EditProfilePage from "./pages/EditProfile";
import { getProfilesByAddress } from "./services/lensQueries";
import AppWelcome from "./components/AppWelcome";
import NewIdeaPage from "./pages/NewIdea";
import ChatsPage from "./pages/ChatsPage";
import ChatPage from "./pages/ChatPage";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import RequestPage from "./pages/RequestPage";

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  async function connectWallet() {
    const _signer = await getSigner();
    setSigner(_signer);
    afterFetchSigner(_signer);
  }

  async function afterFetchSigner(_signer) {
    const _address = await _signer.getAddress();
    setAddress(_address);

    // get pushchat user
    const _user = await getUser(_address);
    setUser(_user);

    const profiles = await getProfilesByAddress(_address);

    const _profile = profiles.find((profile) =>
      profile.attributes.find(
        (attr) => attr.key === "app" && attr.value === "metch"
      )
    );
    if (_profile) {
      setProfile(_profile);
      if (_profile.name) {
        navigate("/home");
        initSocket(_address, _signer);
      } else {
        navigate("/edit-profile");
      }
    } else {
      navigate("/welcome");
    }
  }

  function initSocket(_address, _signer) {
    const pushSDKSocket = createSocketConnection({
      user: `eip155:${_address}`,
      env: "staging",
      socketType: "chat",
      socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    });

    pushSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log("connected");
    });
    pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => console.log(err));
    pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) =>
      console.log("userfeeds", notification)
    );
    pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) =>
      console.log("spam", spam)
    );
    pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (notification) => {
      console.log(notification);
    });

    setSocket(pushSDKSocket);
  }

  useEffect(() => {
    fetchSigner();
    async function fetchSigner() {
      const _signer = await getConnectedAccount();
      setSigner(_signer);
      if (_signer) afterFetchSigner(_signer);
    }
  }, []);

  return (
    <div className="relative app">
      {user && profile && (
        <AppHeader
          profile={profile}
          user={user}
          editProfile={() => {
            navigate("/edit-profile");
          }}
        />
      )}
      <section className="body px-4 py-2">
        {!signer && (
          <div className="p-4">
            <div className="text-center">
              <img className="mx-auto" src="/metch-logo.png" alt="Metch Logo" />
              <p className="text-purple-500 mb-2">
                Match with other frens and start hacking
              </p>
              <button
                onClick={connectWallet}
                className="px-4 py-2 border-2 border-purple-500 rounded-lg text-purple-500"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
        <Routes>
          <Route
            path="/welcome"
            element={
              <AppWelcome
                signer={signer}
                address={address}
                onCreate={() => afterFetchSigner(signer)}
              />
            }
          />
          <Route
            path="/edit-profile"
            element={
              <EditProfilePage
                signer={signer}
                profile={profile}
                user={user}
                onSave={() => afterFetchSigner(signer)}
              />
            }
          />
          <Route
            path="/new-idea"
            element={
              <NewIdeaPage
                signer={signer}
                profile={profile}
                user={user}
                onSave={() => afterFetchSigner(signer)}
              />
            }
          />
          <Route
            path="/home"
            element={<MatcherPage signer={signer} address={address} />}
          />

          <Route
            path="/chats"
            element={<ChatsPage signer={signer} address={address} />}
          />

          <Route
            path="/chat/:id"
            element={
              <ChatPage signer={signer} address={address} socket={socket} />
            }
          />

          <Route
            path="/request/:id"
            element={<RequestPage signer={signer} address={address} />}
          />
        </Routes>
      </section>
      {profile && profile.name && <FooterMenu />}
    </div>
  );
}

export default App;
