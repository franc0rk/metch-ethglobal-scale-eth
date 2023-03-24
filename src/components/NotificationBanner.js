export default function NotificationBanner({ notification }) {
  return (
    <div className="absolute bottom-8 left-0 right-0 w-80 mx-auto p-1 px-4 rounded-lg bg-purple-500 text-white z-10">
      <div className="flex items-center">
        <div className="p-1">
          <img className="w-12" src="/metch-logo-white.png" />
        </div>
        <div className="p-1">
          <div>{notification.title}</div>
          <div>{notification.description}</div>
        </div>
      </div>
    </div>
  );
}
