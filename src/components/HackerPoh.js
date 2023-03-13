export default function HackerPoh() {
  return (
    <div className="p-2">
      <h4 className="mb-2">Proof of Hacking</h4>
      <div className="my-4">
        <p className="my-1">
          <span>🤘</span> francork.eth rocks{" "}
          <span className="text-purple-500">x5</span>
        </p>
        <p>
          <span>🚀</span> francork.eth is going to the moon{" "}
          <span className="text-purple-500">x2</span>
        </p>
        <p>
          <span>🤓</span> francork.eth learns fast{" "}
          <span className="text-purple-500">x3</span>
        </p>
      </div>
      <h5 className="mb-2 ">POAP</h5>
      <div className="flex flex-wrap">
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
