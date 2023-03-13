export default function FilterControls() {
  return (
    <div className="flex justify-evenly items-center mb-2 w-full">
      <div>
        <button>🔎</button>
      </div>
      <div className="flex flex-wrap w-1/ border-2 border-purple-500 rounded">
        <div className="bg-white px-8 py-2 cursor-pointer">💡</div>
        <div className="bg-purple-500 px-8 py-2 cursor-pointer">🧑‍💻</div>
      </div>
      <div>
        <button>⚙️</button>
      </div>
    </div>
  );
}
