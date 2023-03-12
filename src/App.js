import { useState } from "react";
import { getSigner } from "./services/connectWallet";
import ChatFunctions from "./components/ChatFunctions";

function App() {
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    const _signer = await getSigner();
    setSigner(_signer);
  };

  return (
    <div>
      <header className="p-4 bg-purple-600">
        <div>
          <button
            className="bg-white px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </header>
      {signer && <ChatFunctions signer={signer} />}
    </div>
  );
}

export default App;
