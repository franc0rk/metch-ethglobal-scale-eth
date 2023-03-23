export default function IdeaCard({ idea, onLike, onSkip, onBack }) {
  return (
    <div className="sm:flex border border-gray-300 rounded mh-card">
      <div className="relative sm:w-1/3 border-b border-gray-300">
        <img
          className="w-full h-80 sm:h-full"
          src={idea.imageUrl}
          alt="Hacker"
        />

        <button
          className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute top-2 left-2 sm:left-2"
          onClick={() => onBack()}
        >
          ⏪
        </button>
        <button
          className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute bottom-2 left-16 sm:left-2"
          onClick={() => onSkip()}
        >
          ⏩
        </button>
        <button
          className="bg-purple-500 border-2 border-white px-6 py-4 text-2xl rounded-full absolute bottom-2 right-16 sm:right-2"
          onClick={() => onLike()}
        >
          🤍
        </button>
      </div>
      <div className="p-2 sm:w-2/3">
        <div>
          <h3 className="text-lg text-gray-600 mb-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
            💡 {idea.name}
          </h3>
          <div className="flex flex-wrap items-center">
            <div className="w-full mb-2 text-gray-500">{idea.description}</div>

            <div className="w-1/4">
              {idea.profile.picture && (
                <img
                  className="w-16 h-16 rounded-full"
                  alt="profile"
                  src={idea.profile.picture.original.url}
                />
              )}
            </div>
            <div className="w-3/4">
              <p className="text-gray-500 mb-2">by {idea.profile.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
