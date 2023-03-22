import HackerCard from "../components/HackerCard";
import FilterControls from "../components/FilterControls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMetchProfiles } from "../services/lensQueries";
import { keyBy } from "lodash";

export default function MatcherPage({ signer }) {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

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

  function nextProfile() {
    if (currentProfileIndex === profiles.length - 1) {
      setCurrentProfileIndex(0);
    } else {
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  }

  function previousProfile() {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1);
    } else {
      setCurrentProfileIndex(profiles.length - 1);
    }
  }

  function like() {
    setIsLiked(true);
    setTimeout(() => {
      nextProfile();
      setIsLiked(false);
    }, 1000);
  }

  function skip() {
    setIsSkipped(true);
    setTimeout(() => {
      nextProfile();
      setIsSkipped(false);
    }, 1000);
  }

  function back() {
    previousProfile();
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (!signer) {
      navigate("/", { replace: true });
    }
    fetchProfiles();

    async function fetchProfiles() {
      const _profiles = await getMetchProfiles();
      const mappedProfiles = mapProfiles(_profiles);
      setProfiles(mappedProfiles);
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      <FilterControls />
      <div className="w-full relative">
        {profiles.length > 0 && (
          <HackerCard
            signer={signer}
            profile={profiles[currentProfileIndex]}
            onLike={like}
            onSkip={skip}
            onBack={back}
          />
        )}
        {isSkipped && (
          <div className="absolute top-1/4 left-8 right-8 h-16 border-2 bg-white opacity-75 border-gray-500 rounded-lg text-gray-500">
            <div className="text-2xl text-center">
              Maybe
              <br />
              next time
            </div>
          </div>
        )}
        {isLiked && (
          <div className="absolute top-1/4 left-8 right-8 h-16 border-2 bg-white opacity-75 border-purple-500 rounded-lg text-purple-500">
            <div className="text-2xl text-center">
              Let's
              <br />
              hack
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
