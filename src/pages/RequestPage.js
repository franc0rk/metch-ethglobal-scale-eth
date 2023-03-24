import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  approveChat,
  getGroupById,
  getHistory,
  sendChat,
  updateGroup,
} from "../services/pushChat";
import { useState, useEffect } from "react";
import HackerCard from "../components/HackerCard";
import IdeaCard from "../components/IdeaCard";

export default function RequestPage({ signer, address }) {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    const _profile = routerLocation.state.profile;
    const _idea = routerLocation.state.idea;
    const _message = routerLocation.state.message;
    setProfile(_profile);
    setIdea(_idea);
    setMessage(_message);
  }, []);

  async function like() {
    const requesterId = params.id.includes("0x")
      ? `eip155:${params.id}`
      : params.id;

    if (idea) {
      await approveChat(address, requesterId);
      await sendChat(requesterId, "Hello", signer);
    }

    if (profile) {
      const group = await getGroupById(
        "350c8136c702371da2ba271776d7d2055f19b546bfd89b2df1c4896ea9fee226"
      );

      const updatedGroup = await updateGroup(signer, {
        ...group,
        members: [...group.members.map((member) => member.wallet), requesterId],
      });
    }
  }

  async function skip() {}

  return (
    <div className="flex flex-wrap">
      <h4 className="text-lg text-purple-500">Request</h4>
      {profile && (
        <HackerCard
          profile={profile}
          isShowingBack={false}
          message={message}
          onLike={like}
          onSkip={skip}
        />
      )}
      {idea && (
        <IdeaCard
          idea={idea}
          isShowingBack={false}
          message="Hey! I want you to join my team and build this idea. Let's hack!"
          onLike={like}
          onSkip={skip}
        />
      )}
    </div>
  );
}
