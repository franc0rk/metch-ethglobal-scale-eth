import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, createUser } from "../services/pushChat";
import {
  createLensProfile,
  getProfilesByAddress,
  setNewProfileMetadata,
} from "../services/lensQueries";

export default function AppWelcome({ signer, address, onCreate }) {
  const [profileHandle, setProfileHandle] = useState("");
  const [, setUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  async function createProfile() {
    setIsCreating(true);
    if (profileHandle) {
      let _user;
      try {
        _user = await getUser(address);
        if (!_user) _user = await createUser(address);
        setUser(_user);
      } catch (e) {
        _user = await createUser(address);
        setUser(_user);
      }

      await createLensProfile(signer, profileHandle);

      const profiles = await getProfilesByAddress(address);
      const lastProfile = profiles[profiles.length - 1];
      await setNewProfileMetadata(lastProfile.id, signer);

      setTimeout(() => {
        setIsCreating(false);
        onCreate();
        navigate("/");
      }, 5000);
    }
  }
  return (
    <div className="p-4">
      <div className="text-center">
        <img className="mx-auto" src="/metch-logo.png" alt="Metch Logo" />
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
          {isCreating ? "Creating..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
