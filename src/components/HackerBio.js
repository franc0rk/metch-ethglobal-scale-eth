export default function HackerBio() {
  return (
    <div className="p-2">
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </p>
      <ul className="flex flex-wrap my-4">
        <li className="my-1 mr-4">🧑‍💻 @franc0rk</li>
        <li className="my-1 mr-4">🕊️ @franc0rk</li>
        <li className="my-1 mr-4">💬 franc0rk#2704</li>
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
