import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "./UserContext";

import { GET_SCHEDULE } from "../services/api";

const ScheduleContext = React.createContext();

const ScheduleProvider = ({ children }) => {
  const [wasNotified, setWasNotified] = useState(false);
  const [schedule, setSchedule] = useState({
    scheduledEvents: [],
    unscheduledEvents: [],
  });

  const { loggedUser } = useContext(UserContext);

  useEffect(() => {
    async function getSchedule() {
      try {
        const { url, options } = GET_SCHEDULE(loggedUser);
        const response = await fetch(url, options);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.message);

        setSchedule(json.data);
      } catch (error) {
        console.error(error);

        throw new Error(error.message);
      }
    }

    if (loggedUser) getSchedule();
  }, [loggedUser]);

  return (
    <ScheduleContext.Provider
      value={{ schedule, setSchedule, wasNotified, setWasNotified }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export { ScheduleContext, ScheduleProvider };
