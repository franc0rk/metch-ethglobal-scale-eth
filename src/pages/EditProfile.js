import { useEffect, useState } from "react";
import { keyBy } from "lodash";
import { setProfileMetadata, setProfileImage } from "../services/lensQueries";
import axios from "axios";
import HackerCard from "../components/HackerCard";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage({ signer, profile, user, onSave }) {
  async function storeMetadata() {
    const metadata = {
      version: "1.0.0",
      metadata_id: "ec86dbbb-cb22-4606-9013-cf6d9587c26a",
      name: profileForm.name,
      bio: profileForm.bio,
      cover_picture: null,
      attributes: [
        { traitType: "string", key: "role", value: profileForm.role },
        {
          traitType: "string",
          key: "experience",
          value: profileForm.experience,
        },
        { traitType: "string", key: "status", value: profileForm.status },
        { traitType: "string", key: "location", value: profileForm.location },
        { traitType: "string", key: "interests", value: profileForm.interests },
        { traitType: "string", key: "github", value: profileForm.github },
        { traitType: "string", key: "twitter", value: profileForm.twitter },
        { traitType: "string", key: "discord", value: profileForm.discord },
        { traitType: "string", key: "app", value: "metch" },
      ],
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

    const res = await axios(config);
    // window.open(`https://ipfs.io/ipfs/${res.data.IpfsHash}`, "_blank");
    return `ipfs://${res.data.IpfsHash}`;
  }

  async function saveImage() {
    if (profileForm.imageUrl) {
      setProfileImage(profile.id, profileForm.imageUrl, signer);
    }
  }

  async function save() {
    setIsSaving(true);
    const metadataUrl = await storeMetadata();

    await setProfileMetadata(profile.id, metadataUrl, signer);
    onSave();
    navigate("/", { replace: true });
  }

  const navigate = useNavigate();
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    status: "",
    role: "",
    location: "",
    bio: "",
    experience: "",
    imageUrl: "",
    interests: "",
    picture: "",
    github: "",
    twitter: "",
    discord: "",
  });

  useEffect(() => {
    if (!profile) {
      navigate("/", { replace: true });
    } else {
      const keyedAttributes = keyBy(profile.attributes, "key");

      const _profileForm = {
        name: profile.name || "",
        status: keyedAttributes["status"]
          ? keyedAttributes["status"].value
          : "looking_for_team",
        role: keyedAttributes["role"] ? keyedAttributes["role"].value : "",
        location: keyedAttributes["location"]
          ? keyedAttributes["location"].value
          : "",
        bio: profile.bio || "",
        experience: keyedAttributes["experience"]
          ? keyedAttributes["experience"].value
          : "",
        interests: keyedAttributes["interests"]
          ? keyedAttributes["interests"].value
          : "",
        imageUrl:
          profile.picture && profile.picture.original
            ? profile.picture.original.url
            : user
            ? user.profilePicture
            : "https://gateway.pinata.cloud/ipfs/QmR7CvV4tPQ2bR8e369rCQDy4sEVGHJWjMf4Q1X88yamQU",
        github: keyedAttributes["github"]
          ? keyedAttributes["github"].value
          : "",
        twitter: keyedAttributes["twitter"]
          ? keyedAttributes["twitter"].value
          : "",
        discord: keyedAttributes["discord"]
          ? keyedAttributes["discord"].value
          : "",
      };

      setProfileForm(_profileForm);
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      {profile && !isPreviewing && (
        <div className="w-full">
          <h3 className="text-purple-500 text-lg">
            {profile.name ? "Edit" : "Complete"} Profile
          </h3>
          <div className="mb-2">
            <label className="text-xs text-gray-500">
              Name<span className="text-purple-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Name"
              value={profileForm.name}
              onChange={(e) => {
                setProfileForm({ ...profileForm, name: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">
              Status<span className="text-purple-500">*</span>
            </label>
            <select
              className="w-full border text-gray-500 border-gray-300 p-2 rounded-lg"
              placeholder="Status"
              value={profileForm.status}
              onChange={(e) => {
                setProfileForm({ ...profileForm, status: e.target.value });
              }}
            >
              <option value="looking_for_team">Looking for a team</option>
              <option value="hacking">Hacking</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">
              Role<span className="text-purple-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Role"
              value={profileForm.role}
              onChange={(e) => {
                setProfileForm({ ...profileForm, role: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Location</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Location"
              value={profileForm.location}
              onChange={(e) => {
                setProfileForm({ ...profileForm, location: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Bio</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Bio"
              value={profileForm.bio}
              onChange={(e) => {
                setProfileForm({ ...profileForm, bio: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Experience</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Experience"
              value={profileForm.experience}
              onChange={(e) => {
                setProfileForm({ ...profileForm, experience: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Interests</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Interests"
              value={profileForm.interests}
              onChange={(e) => {
                setProfileForm({ ...profileForm, interests: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Picture</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Image URL"
              value={profileForm.imageUrl}
              onChange={(e) => {
                setProfileForm({ ...profileForm, imageUrl: e.target.value });
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  saveImage();
                }
              }}
            />
            {profileForm.imageUrl && (
              <img
                className="rounded-lg mt-2"
                src={profileForm.imageUrl}
                alt="url"
              />
            )}
            <button
              className="self-end my-2 border-2 border-gray-300 text-gray-300 p-1 text-xs rounded-lg"
              disabled
            >
              Mint Avatar NFT(Coming soon)
            </button>
            {/* <button className="self-end my-2 border-2 border-purple-500 text-purple-500 p-1 text-xs rounded-lg">
              Change picture
            </button> */}
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Github</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Github"
              value={profileForm.github}
              onChange={(e) => {
                setProfileForm({ ...profileForm, github: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Twitter</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Twitter"
              value={profileForm.twitter}
              onChange={(e) => {
                setProfileForm({ ...profileForm, twitter: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Discord</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Discord"
              value={profileForm.discord}
              onChange={(e) => {
                setProfileForm({ ...profileForm, discord: e.target.value });
              }}
            />
          </div>
          <div className="mt-4 flex justify-end">
            {profile.name && (
              <button
                className="border-2 border-gray-500 text-gray-500 p-2 rounded-lg mr-2"
                onClick={() => navigate("/home")}
              >
                Back
              </button>
            )}
            <button
              onClick={() => setIsPreviewing(true)}
              className="border-2 border-purple-500 text-purple-500 p-2 rounded-lg mr-2"
            >
              Preview
            </button>
            <button
              onClick={() => save()}
              className="border-2 bg-purple-500 border-purple-500 text-white p-2 rounded-lg"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
      {isPreviewing && (
        <div className="w-full">
          <HackerCard profile={profileForm} />
          <button
            onClick={() => setIsPreviewing(false)}
            className="mt-2 border-2 border-purple-500 text-purple-500 p-2 rounded-lg mr-2"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
