import { Link } from "react-router-dom";

export default function FooterMenu() {
  return (
    <footer className="fixed w-full bg-purple-500 text-white bottom-0">
      <div className="flex justify-evenly items-center  h-16">
        <div>
          <Link to="/home">🏠 Home</Link>
        </div>
        <Link to="/chats">
          <div>💬 Chat</div>
        </Link>
        <Link to="/calendar">
          <div>🗓️ Calendar</div>
        </Link>
      </div>
    </footer>
  );
}
