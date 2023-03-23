export default function FilterControls({ viewMode, onChange }) {
  return (
    <div className="flex justify-evenly items-center mb-2 w-full">
      <div>
        <button>🔎</button>
      </div>
      <div className="flex flex-wrap w-1/ border-2 border-purple-500 rounded">
        <div
          className={`${
            viewMode === "ideas" ? "bg-purple-500" : "bg-white"
          } cursor-pointer`}
        >
          <button
            className="px-8 py-2"
            onClick={() => onChange({ viewMode: "ideas" })}
          >
            💡
          </button>
        </div>
        <div
          className={`${
            viewMode === "hackers" ? "bg-purple-500" : "bg-white"
          } cursor-pointer`}
        >
          <button
            className="px-8 py-2 "
            onClick={() => onChange({ viewMode: "hackers" })}
          >
            🤓
          </button>
        </div>
      </div>
      <div>
        <button>⚙️</button>
      </div>
    </div>
  );
}
