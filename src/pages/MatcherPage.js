import HackerCard from "../components/HackerCard";
import FilterControls from "../components/FilterControls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIdeas, getMetchProfiles } from "../services/lensQueries";
import { keyBy } from "lodash";
import IdeaCard from "../components/IdeaCard";
import { sendChat } from "../services/pushChat";
import { getIdeaAttribute, DEFAULT_IMAGE_URL } from "../utils";

export default function MatcherPage({ signer, address }) {
  const [profiles, setProfiles] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [viewMode, setViewMode] = useState("ideas");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

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

  function mapIdeas(_ideas) {
    const filteredIdeas = _ideas.filter(
      (_idea) => _idea.profile.ownedBy !== address
    );

    const mappedIdeas = filteredIdeas.map((_idea) => ({
      name: _idea.metadata.name,
      description: _idea.metadata.description,
      imageUrl: getIdeaAttribute(_idea, "imageUrl", DEFAULT_IMAGE_URL),
      chatGroupId: getIdeaAttribute(_idea, "chatGroupId", ""),
      profile: _idea.profile,
    }));

    return mappedIdeas;
  }

  function nextItem() {
    if (viewMode === "hackers") {
      if (currentProfileIndex === profiles.length - 1) {
        setCurrentProfileIndex(0);
      } else {
        setCurrentProfileIndex(currentProfileIndex + 1);
      }
    } else {
      if (currentIdeaIndex === ideas.length - 1) {
        setCurrentIdeaIndex(0);
      } else {
        setCurrentIdeaIndex(currentIdeaIndex + 1);
      }
    }
  }

  function previousItem() {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(currentProfileIndex - 1);
    } else {
      setCurrentProfileIndex(profiles.length - 1);
    }
  }

  async function like() {
    setIsLiked(true);
    if (viewMode === "ideas") {
      const idea = ideas[currentIdeaIndex];
      const chat = await sendChat(
        idea.profile.ownedBy,
        `Hey I want to be part of your idea ${idea.name}. Let's hack together`,
        signer
      );
    }
    setTimeout(() => {
      nextItem();
      setIsLiked(false);
    }, 1000);
  }

  function skip() {
    setIsSkipped(true);
    setTimeout(() => {
      nextItem();
      setIsSkipped(false);
    }, 1000);
  }

  function back() {
    previousItem();
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (!signer) {
      navigate("/", { replace: true });
    }

    fetchIdeas();
    fetchProfiles();

    async function fetchIdeas() {
      const _ideas = await getIdeas();
      const mappedIdeas = mapIdeas(_ideas);
      setIdeas(mappedIdeas);
    }

    async function fetchProfiles() {
      const _profiles = await getMetchProfiles();
      const mappedProfiles = mapProfiles(_profiles);
      setProfiles(mappedProfiles);
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      <FilterControls
        viewMode={viewMode}
        onChange={(e) => setViewMode(e.viewMode)}
      />
      <div className="w-full relative">
        {profiles.length > 0 && viewMode === "hackers" && (
          <HackerCard
            profile={profiles[currentProfileIndex]}
            onLike={like}
            onSkip={skip}
            onBack={back}
          />
        )}
        {ideas.length > 0 && viewMode === "ideas" && (
          <IdeaCard
            idea={ideas[currentIdeaIndex]}
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
