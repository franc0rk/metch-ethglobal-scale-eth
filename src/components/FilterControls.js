import { Link } from "react-router-dom";

export default function FilterControls({
  viewMode,
  currentIdea,
  ideas,
  onChange,
  onChangeIdea,
}) {
  return (
    <div className="flex flex-wrap items-center mb-2 w-full">
      <div className="w-1/3 text-center px-4">
        <button>🔎</button>
      </div>
      <div className="w-1/3">
        <div className="flex flex-wrap border-2 border-purple-500 rounded">
          <div
            className={`w-1/2 ${
              viewMode === "ideas" ? "bg-purple-500" : "bg-white"
            } cursor-pointer`}
          >
            <button
              className="w-full px-4 py-2"
              onClick={() => onChange({ viewMode: "ideas" })}
            >
              💡
            </button>
          </div>
          <div
            className={`w-1/2 ${
              viewMode === "hackers" ? "bg-purple-500" : "bg-white"
            } cursor-pointer`}
          >
            <button
              className="w-full px-4 py-2"
              onClick={() => onChange({ viewMode: "hackers" })}
            >
              🤓
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/3 text-center px-4">
        {viewMode === "hackers" && (
          <div className="flex flex-col">
            <div className="text-xs text-purple-500">Looking hackers for:</div>
            {ideas.length > 0 ? (
              <select
                value={currentIdea.id}
                className="text-xs text-gray-500 px-1 border border-gray-300 rounded-lg"
                onChange={(e) => onChangeIdea(e.target.value)}
              >
                {ideas.map((idea) => (
                  <option value={idea.id}>{idea.metadata.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-purple-500 underline">
                <Link to="/new-idea">Create idea</Link>
              </div>
            )}
          </div>
        )}
        {viewMode === "ideas" && (
          <div className="text-xs text-purple-500">Looking for ideas</div>
        )}
      </div>
    </div>
  );
}
