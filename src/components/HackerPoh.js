import { useEffect, useState } from "react";
import axios from "axios";

export default function HackerPoh({ profile }) {
  const [poaps, setPoaps] = useState([]);

  useEffect(() => {
    fetchPoap();

    async function fetchPoap() {
      const { data: _poaps } = await axios.get(
        `https://frontend.poap.tech/actions/scan/${profile.address}`
      );
      setPoaps(_poaps);
    }
  }, [profile.address]);

  return (
    <div className="p-2">
      <h4 className="mb-2 text-purple-500">Proof of Hacking</h4>
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
      {poaps.length > 0 && (
        <div className="flex flex-wrap">
          <h5 className="mb-2 text-purple-500 w-full">POAP</h5>
          {poaps.map((poap, poapIndex) => (
            <div
              className="flex justify-center items-center w-12 h-12 mb-2 cursor-pointer mr-2"
              key={`poap-${poapIndex}`}
            >
              <img
                className=" rounded-full"
                src={poap.event.image_url}
                alt={poap.event.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
