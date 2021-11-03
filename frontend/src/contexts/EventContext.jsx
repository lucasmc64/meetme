import React, { useState } from "react";

const EventContext = React.createContext();

const EventProvider = ({ children }) => {
  const [eventFromServer, setEventFromServer] = useState(null);
  const [event, setEvent] = useState({
    name: "",
    description: "",
    dates: [],
    guests: [],
    host: null,
  });

  const [isScheduled, setIsScheduled] = useState(null);

  return (
    <EventContext.Provider
      value={{
        event,
        setEvent,
        eventFromServer,
        setEventFromServer,
        isScheduled,
        setIsScheduled,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export { EventContext, EventProvider };
