export default function AppHeader({ profile, user, editProfile }) {
  return (
    <header className="bg-purple-500 text-white p-2">
      <nav>
        <div className="flex items-center justify-around">
          <div>New idea</div>
          <div>
            <img
              className="h-12"
              src="/metch-logo-white.png"
              alt="Metch logo white"
            />
          </div>
          <div>
            <div className="w-full">
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
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
