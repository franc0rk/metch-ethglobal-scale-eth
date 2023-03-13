export default function AppHeader() {
  return (
    <header className=" bg-purple-500 text-white p-2">
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
                className="w-12 h-12 rounded-full"
                src="https://i.seadn.io/gcs/files/02e4178031e907bcfaaa7e030254da3b.png?auto=format&w=1000"
                alt="Hacker"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
