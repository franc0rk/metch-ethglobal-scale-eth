import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { createPublication } from "../services/lensQueries";
import { createGroup } from "../services/pushChat";
import IdeaCard from "../components/IdeaCard";

export default function NewIdeaPage({ signer, profile, onSave }) {
  const [ideaForm, setIdeaForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  //   const validateResult = await lensClient.publication.validateMetadata(metadata);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const navigate = useNavigate();

  async function createChatGroup() {
    const group = await createGroup(signer, {
      groupName: ideaForm.name,
      groupDescription: ideaForm.description.substring(0, 150),
      groupImage: ideaForm.imageUrl,
    });

    return group;
  }

  async function save() {
    setIsSaving(true);
    const chatGroup = await createChatGroup();
    const metadata = {
      appId: "metch",
      attributes: [
        {
          displayType: "string",
          traitType: "imageUrl",
          value: ideaForm.imageUrl,
        },
        {
          displayType: "string",
          traitType: "chatGroupId",
          value: chatGroup.chatId,
        },
      ],
      content: ideaForm.description,
      description: ideaForm.description,
      locale: "en-US",
      mainContentFocus: "TEXT_ONLY",
      metadata_id: v4(),
      name: ideaForm.name,
      tags: ["metch"],
      version: "2.0.0",
    };

    await createPublication(signer, profile.id, metadata);

    navigate("/", { replace: true });
    setIsSaving(false);
  }

  return (
    <div className="flex flex-wrap">
      {!isPreviewing && (
        <div className="w-full">
          <h3 className="text-purple-500 text-lg">
            {false ? "Edit" : "Create"} Idea
          </h3>
          <div className="mb-2">
            <label className="text-xs text-gray-500">
              Name<span className="text-purple-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Name"
              value={ideaForm.name}
              onChange={(e) => {
                setIdeaForm({ ...ideaForm, name: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Description"
              value={ideaForm.description}
              rows="10"
              onChange={(e) => {
                setIdeaForm({ ...ideaForm, description: e.target.value });
              }}
            />
          </div>
          <div className="mb-2">
            <label className="text-xs text-gray-500">Picture</label>
            <input
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Image URL"
              value={ideaForm.imageUrl}
              onChange={(e) => {
                setIdeaForm({ ...ideaForm, imageUrl: e.target.value });
              }}
            />
            {ideaForm.imageUrl && (
              <img
                className="rounded-lg mt-2"
                src={ideaForm.imageUrl}
                alt="url"
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="border-2 border-gray-500 text-gray-500 p-2 rounded-lg mr-2"
              onClick={() => navigate("/home")}
            >
              Back
            </button>
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
          <IdeaCard idea={{ ...ideaForm, profile }} />
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
