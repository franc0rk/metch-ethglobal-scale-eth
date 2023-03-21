import HackerBio from "./HackerBio";
import HackerExperience from "./HackerExperience";
import HackerPoh from "./HackerPoh";
import HackerHobbies from "./HackerHobbies";
import { useState } from "react";

export default function HackerCard({ profile }) {
  const [activeTab, setActiveTab] = useState("bio");
  const statuses = {
    looking_for_team: "Looking for a team",
    hacking: "Hacking",
    inactive: "Inactive",
  };

  return (
    <div className="sm:flex border border-gray-300 rounded">
      <div className="relative sm:w-1/3">
        <img className="w-full h-full" src={profile.imageUrl} alt="Hacker" />
        <button className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute top-2 left-2 sm:left-2">
          ⏪
        </button>
        <button className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute bottom-2 left-16 sm:left-2">
          ⏩
        </button>
        <button className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute bottom-2 right-16 sm:right-2">
          🤍
        </button>
      </div>
      <div className="p-2 sm:w-2/3">
        <div>
          <h3 className="text-lg text-gray-600 mb-2">🤓 {profile.name}</h3>
          <p className="text-gray-500 mb-2">
            🔎 {statuses[profile.status]}{" "}
            {profile.location && `at ${profile.location}`}
          </p>
          <div className="flex flex-wrap tabs -mx-2">
            <div className="w-full border-b border-b-gray-300">
              <ul className="flex">
                <li
                  className={`p-1 text-center hover:border-b-4 border-b-purple-500 cursor-pointer ${
                    activeTab === "bio" && "border-b-4 border-b-purple-500"
                  }`}
                  onClick={() => setActiveTab("bio")}
                >
                  <span title="Description">📝 Bio</span>
                </li>
                <li
                  className={`p-1 text-center hover:border-b-4 border-b-purple-500 cursor-pointer ${
                    activeTab === "experience" &&
                    "border-b-4 border-b-purple-500"
                  }`}
                  onClick={() => setActiveTab("experience")}
                >
                  <span title="Experience">💼 Experience</span>
                </li>
                <li
                  className={`p-1 text-center hover:border-b-4 border-b-purple-500 cursor-pointer ${
                    activeTab === "poh" && "border-b-4 border-b-purple-500"
                  }`}
                  onClick={() => setActiveTab("poh")}
                >
                  <span title="Proof of Hacking">💻 POH</span>
                </li>
                <li
                  className={`p-1 text-center hover:border-b-4 border-b-purple-500 cursor-pointer ${
                    activeTab === "hobbies" && "border-b-4 border-b-purple-500"
                  }`}
                  onClick={() => setActiveTab("hobbies")}
                >
                  <span title="Hobbies">⛰️ Hobbies</span>
                </li>
              </ul>
            </div>
            <div className="w-full">
              {activeTab === "bio" && <HackerBio profile={profile} />}
              {activeTab === "experience" && (
                <HackerExperience experience={profile.experience} />
              )}
              {activeTab === "poh" && <HackerPoh />}
              {activeTab === "hobbies" && (
                <HackerHobbies interests={profile.interests} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
