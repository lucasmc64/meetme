import React, { useCallback, useEffect, useState } from "react";

import { GET_ALL_POSSIBLE_DATES } from "../services/api";

import styles from "../styles/components/ScheduleOverlap.module.css";
import { generateRandomColor } from "../utils/colors";
import { formatDateToDisplay2 } from "../utils/dates";

const ScheduleOverlap = ({ event }) => {
  const [allPossibleDates, setAllPossibleDates] = useState(null);

  const hoursArray = Array.from(Array(24).keys());

  const compareTimetables = useCallback((timetable1, timetable2) => {}, []);

  useEffect(() => {
    async function getAllPossibleDates() {
      try {
        const { url, options } = GET_ALL_POSSIBLE_DATES(event.name, [
          event.host,
          ...event.guests,
        ]);
        const response = await fetch(url, options);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.message);

        setAllPossibleDates(json.data);
      } catch (error) {
        console.error(
          "Falha no buscar todas os possíveis horários: " + error.message,
        );
      }
    }

    if (event) getAllPossibleDates();
  }, [event]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Comparando horários</h3>

      <div className={styles.hoursAndDates}>
        <ul className={styles.hoursList}>
          {hoursArray.map((hour) => {
            return <li key={hour}>{`${hour}`.padStart(2, "0") + ":00"}</li>;
          })}
        </ul>

        <div className={styles.dates}>
          {event.possibleDates.map(({ date }) => {
            const timetablesAllAgree = [];

            const possibleDatesForNow =
              allPossibleDates?.filter((possibleDate) => {
                return possibleDate.date === date;
              }) ?? [];

            if (
              possibleDatesForNow.every(({ timetables }) => timetables.length)
            ) {
              //possibleDatesForNow.forEach()
            }

            return (
              <div key={date} className={styles.dateContainer}>
                <div className={styles.dateBlock}>
                  {possibleDatesForNow.flatMap(({ date, timetables }) => {
                    if (timetables.length) {
                      const startDate = new Date(`${date} 00:00`);

                      return timetables.map(({ from, to }) => {
                        const possibleStartDate = new Date(`${date} ${from}`);
                        const possibleEndDate = new Date(`${date} ${to}`);

                        const barHeight =
                          ((possibleEndDate - possibleStartDate) /
                            (1000 * 60 * 60 * 24)) *
                          100;

                        const barTop =
                          ((possibleStartDate - startDate) /
                            (1000 * 60 * 60 * 24)) *
                          100;

                        return (
                          <div
                            className={styles.timetable}
                            style={{
                              background: generateRandomColor(),
                              height: `${barHeight}%`,
                              top: `${barTop}%`,
                            }}
                          />
                        );
                      });
                    }

                    return null;
                  })}
                </div>

                <span className={styles.dateLabel}>
                  {formatDateToDisplay2(date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleOverlap;
