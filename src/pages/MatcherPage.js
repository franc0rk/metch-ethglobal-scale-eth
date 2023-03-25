import HackerCard from "../components/HackerCard";
import FilterControls from "../components/FilterControls";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  commentPublication,
  getPublications,
  getMetchProfiles,
} from "../services/lensQueries";
import { chain, keyBy, shuffle } from "lodash";
import IdeaCard from "../components/IdeaCard";
import { getGroupById, sendChat, updateGroup } from "../services/pushChat";
import { getPublicationAttribute, DEFAULT_IMAGE_URL } from "../utils";
import { PublicationTypes } from "@lens-protocol/client";

export default function MatcherPage({ profile, signer, address }) {
  const [profiles, setProfiles] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [comments, setComments] = useState({});
  const [myIdeas, setMyIdeas] = useState([]);
  const [myMappedIdeas, setMyMappedIdeas] = useState({});
  const [currentIdea, setCurrentIdea] = useState(null);
  const [viewMode, setViewMode] = useState("ideas");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  function mapProfiles(_profiles) {
    const filteredProfiles = _profiles.filter(
      (_profile) =>
        _profile.attributes &&
        _profile.bio?.length > 30 &&
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

  function mapComments(_comments) {
    const filteredComments = _comments.filter((_comment) => {
      return _comment.__typename === "Comment";
    });

    const mappedComments = filteredComments.map((_comment) => {
      return {
        content: _comment.metadata.content,
        chatId: getPublicationAttribute(_comment, "chatId", ""),
        address: _comment.profile.ownedBy,
        to: _comment.mainPost.profile.ownedBy,
      };
    });

    const data = chain(mappedComments)
      .uniqBy((x) => x.address && x.chatId)
      .groupBy((x) => `${x.address}-${x.to}`)
      .value();

    return data;
  }

  function mapIdeas(_ideas) {
    const filteredIdeas = _ideas.filter(
      (_idea) =>
        _idea.profile.ownedBy !== address &&
        _idea.metadata &&
        _idea.metadata.description.length > 30 &&
        _idea.metadata.attributes.some(
          (_attr) => _attr.traitType === "chatGroupId"
        )
    );

    const mappedIdeas = filteredIdeas.map((_idea) => ({
      id: _idea.id,
      name: _idea.metadata.name,
      description: _idea.metadata.description,
      imageUrl: getPublicationAttribute(_idea, "imageUrl", DEFAULT_IMAGE_URL),
      chatGroupId: getPublicationAttribute(_idea, "chatGroupId", ""),
      profile: _idea.profile,
      idea: _idea,
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
      const commentMessage = `Hey! I want to be part of your idea ${idea.name}. Let's hack!`;
      const comment = await commentPublication(
        idea.id,
        profile.id,
        idea.chatGroupId,
        commentMessage,
        signer
      );
      const chat = await sendChat(idea.profile.ownedBy, commentMessage, signer);
    } else {
      const groupChatId = getPublicationAttribute(
        currentIdea,
        "chatGroupId",
        ""
      );
      const currentProfile = profiles[currentProfileIndex];
      const group = await getGroupById(groupChatId);
      await updateGroup(signer, {
        ...group,
        members: [
          ...group.members.map((member) => member.wallet),
          currentProfile.address,
        ],
      });
    }
    nextItem();
    setIsLiked(false);
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
      const _ideas = await getPublications([
        PublicationTypes.Post,
        PublicationTypes.Comment,
      ]);
      const mappedIdeas = mapIdeas(_ideas);
      const mappedComments = mapComments(_ideas);
      setIdeas(shuffle(mappedIdeas));
      const _myIdeas = _ideas.filter(
        (_idea) =>
          _idea.profile.ownedBy === address && _idea.__typename === "Post"
      );
      setMyIdeas(_myIdeas);
      setMyMappedIdeas(keyBy(_myIdeas, "id"));
      setCurrentIdea(_myIdeas[0]);
      setComments(mappedComments);
    }

    async function fetchProfiles() {
      const _profiles = await getMetchProfiles();
      const mappedProfiles = mapProfiles(_profiles);
      setProfiles(shuffle(mappedProfiles));
    }
  }, []);

  return (
    <div className="flex flex-wrap">
      <FilterControls
        viewMode={viewMode}
        ideas={myIdeas}
        currentIdea={currentIdea}
        onChange={(e) => setViewMode(e.viewMode)}
        onChangeIdea={(id) => setCurrentIdea(myMappedIdeas[id])}
      />
      <div className="w-full relative">
        {profiles.length > 0 && viewMode === "hackers" && (
          <HackerCard
            profile={profiles[currentProfileIndex]}
            isShowingBack={currentProfileIndex !== 0}
            disabled={myIdeas.length === 0}
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
