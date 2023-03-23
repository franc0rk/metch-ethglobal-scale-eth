export default function HackerBio({ profile }) {
  return (
    <div className="p-2">
      <p>{profile.bio}</p>
      <ul className="flex flex-wrap my-4">
        {profile.github && <li className="my-1 mr-4">🌐 {profile.github}</li>}
        {profile.twitter && <li className="my-1 mr-4">🕊️ {profile.twitter}</li>}
        {profile.discord && <li className="my-1 mr-4">💬 {profile.discord}</li>}
      </ul>
    </div>
  );
}
