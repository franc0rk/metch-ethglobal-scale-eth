import { useState } from "react";
import { getSigner } from "./services/connectWallet";
import AppHeader from "./components/AppHeader";
import FooterMenu from "./components/FooterMenu";
import MatcherPage from "./pages/MatcherPage";
import { createUser, getUser } from "./services/pushChat";
import EditProfilePage from "./pages/EditProfile";
import {
  createLensProfile,
  getProfiles,
  setNewProfileMetadata,
} from "./services/lensQueries";
function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [profileHandle, setProfileHandle] = useState("");
  const [user, setUser] = useState(null);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  async function connectWallet() {
    const _signer = await getSigner();
    setSigner(_signer);
    const _address = await _signer.getAddress();
    setAddress(_address);

    // get pushchat user
    const _user = await getUser(_address);
    setUser(_user);

    const profiles = await getProfiles(_address);

    const _profile = profiles.find((profile) =>
      profile.attributes.find(
        (attr) => attr.key === "app" && attr.value === "metch"
      )
    );
    setProfile(_profile);
    const _hasCompletedProfile = Boolean(_profile && _profile.name);
    setHasCompletedProfile(_hasCompletedProfile);
    setIsEditingProfile(!_hasCompletedProfile);
  }

  async function createProfile() {
    if (profileHandle) {
      let _user;
      try {
        _user = await getUser(address);
        setUser(_user);
      } catch (e) {
        _user = await createUser(address);
        setUser(_user);
      }
      await createLensProfile(signer, profileHandle);
      const profiles = await getProfiles(address);
      const lastProfile = profiles[profiles.length - 1];
      await setNewProfileMetadata(lastProfile.id, signer);
      if (lastProfile.attributes.length <= 1) {
        setIsEditingProfile(true);
      }
    }
  }

  function editProfile() {
    setIsEditingProfile(true);
  }

  return (
    <div className="relative app">
      {user && profile && (
        <AppHeader profile={profile} user={user} editProfile={editProfile} />
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
        {(signer && !user) ||
          (signer && !hasCompletedProfile && !isEditingProfile && (
            <div className="p-4">
              <div className="text-center">
                <img
                  className="mx-auto"
                  src="/metch-logo.png"
                  alt="Metch Logo"
                />
                <p className="text-purple-500 mb-2">
                  Match with other frens and start hacking
                </p>
                <p className="text-gray-500">Welcome</p>
                <p className="text-gray-500 m-w-full mb-2 overflow-hidden overflow-ellipsis">
                  {address}
                </p>
                <div className="mb-2">
                  <label className="text-xs text-gray-500">Handle</label>
                  <input
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    placeholder="Handle"
                    value={profileHandle}
                    onChange={(e) => setProfileHandle(e.target.value)}
                  />
                </div>
                <button
                  onClick={createProfile}
                  className="px-4 py-2 border-2 border-purple-500 rounded-lg text-purple-500"
                >
                  Create Profile
                </button>
              </div>
            </div>
          ))}
        {user && hasCompletedProfile && !isEditingProfile && (
          <MatcherPage signer={signer} />
        )}
        {signer && isEditingProfile && (
          <EditProfilePage signer={signer} profile={profile} user={user} />
        )}
      </section>
      {user && <FooterMenu />}
    </div>
  );
}

export default App;
