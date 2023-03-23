import { useNavigate } from "react-router-dom";

export default function AppHeader({ profile, user, editProfile }) {
  const navigate = useNavigate();

  return (
    <header className="bg-purple-500 text-white p-2">
      <nav>
        <div className="flex items-center justify-around">
          <div>
            {profile.name && (
              <button
                className="border-2 border-white py-1 px-2 rounded-lg"
                onClick={() => navigate("/new-idea", { replace: true })}
              >
                New idea
              </button>
            )}
          </div>
          <div>
            <img
              className="h-12 cursor-pointer"
              src="/metch-logo-white.png"
              alt="Metch logo white"
              onClick={() => navigate("/home", { replace: true })}
            />
          </div>
          <div>
            <div className="w-full">
              {profile.name && (
                <img
                  onClick={() => editProfile()}
                  className="w-12 h-12 rounded-full cursor-pointer"
                  src={
                    profile.picture && profile.picture.original
                      ? profile.picture.original.url
                      : user.profilePicture
                  }
                  alt="Hacker"
                />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
