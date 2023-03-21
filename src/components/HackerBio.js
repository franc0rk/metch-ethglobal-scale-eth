export default function HackerBio({ profile }) {
  return (
    <div className="p-2">
      <p>{profile.bio}</p>
      <ul className="flex flex-wrap my-4">
        {profile.github && <li className="my-1 mr-4">🌐 {profile.github}</li>}
        {profile.twitter && <li className="my-1 mr-4">🕊️ {profile.twitter}</li>}
        {profile.discord && <li className="my-1 mr-4">💬 {profile.discord}</li>}
      </ul>
      <div className="flex flex-wrap">
        <h4 className="font-bold text-purple-500 w-full mb-2">Ideas</h4>
        {[1, 2, 3, 4].map((el) => (
          <div
            className="flex justify-center items-center w-12 h-12 border-2 border-gray-300 rounded-full cursor-pointer mr-2"
            key={el}
          >
            <span>{el}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
