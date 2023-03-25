import { CALENDAR_EVENTS } from "../utils";

export default function CalendarPage() {
  return (
    <div className="flex flex-wrap">
      <div className="flex w-full mb-2 text-purple-500">
        <div className="text-lg flex-1">Calendar</div>
        <div className="text-sm">
          <a className="underline">Add Event</a>
        </div>
      </div>
      <div className="w-full">
        {CALENDAR_EVENTS.map((event, eventIndex) => (
          <div className="flex flex-wrap items-start my-2" key={eventIndex}>
            <div className="w-1/12">
              <img
                className="w-full h-full pt-4 rounded-full"
                src={event.image}
                alt="event"
              />
            </div>
            <div className="w-5/12 p-2">
              <h5 className="text-gray-600">{event.name}</h5>
              <p className="text-gray-500 text-sm">{event.date}</p>
              <p className="text-purple-500 text-sm">
                <button href="#">More info</button>
              </p>
            </div>
            <div className="w-1/2 text-xs text-gray-500">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
