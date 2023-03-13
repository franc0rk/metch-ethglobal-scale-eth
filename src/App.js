import { useState } from "react";
import { getSigner } from "./services/connectWallet";
import AppHeader from "./components/AppHeader";
import FooterMenu from "./components/FooterMenu";
import MatcherPage from "./pages/MatcherPage";

function App() {
  const [signer, setSigner] = useState(null);
  const [user, setUser] = useState(null);

  const connectWallet = async () => {
    const _signer = await getSigner();
    setSigner(_signer);
  };

  return (
    <div className="relative app">
      {user && <AppHeader />}
      <section className="body px-4 py-2">
        {!signer && (
          <div className="p-4">
            <div className="text-center">
              <img className="mx-auto" src="/metch-logo.png" alt="Metch Logo" />
              <p className="text-purple-500 mb-2">
                Match with other frens and start hacking
              </p>
              <button
                onClick={connectWallet}
                className="px-4 py-2 border-2 border-purple-500 rounded-lg text-purple-500"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
        {signer && <MatcherPage />}
      </section>
      {user && <FooterMenu />}
    </div>
  );
}

export default App;
