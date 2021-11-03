import React, { useContext, useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { ScheduleContext } from "../contexts/ScheduleContext";

import {
  datePlusTimezoneOffset,
  formatDateToDisplay1,
  formatDateToInput,
  getMonthDaysArray,
  getWeek,
} from "../utils/dates";

import Button from "../components/Button";
import Modal from "../components/Modal";

import styles from "../styles/pages/Schedule.module.css";
import stylesButton from "../styles/components/Button.module.css";
import stylesModal from "../styles/components/Modal.module.css";

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(() => {
    return getWeek(currentDate);
  });
  const [viewMode, setViewMode] = useState("monthly");

  const {
    schedule: { scheduledEvents, unscheduledEvents },
    wasNotified,
    setWasNotified,
  } = useContext(ScheduleContext);
  const { loggedUser, isNewAccount, wasLoggedWithAutoLogin, isLogged } =
    useContext(UserContext);

  const monthDaysArray = getMonthDaysArray(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const weeksArray = Array.from(Array(monthDaysArray.length / 7).keys());

  const today = new Date();

  const nextThreeDays = [
    formatDateToInput(today),
    formatDateToInput(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    ),
    formatDateToInput(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    ),
  ];

  const scheduledEventsForNextThreeDays = nextThreeDays.flatMap(
    (formattedDate) => {
      return scheduledEvents.filter((event) => {
        return event.scheduledDates.some(({ date }) => {
          return date === formattedDate;
        });
      });
    },
  );

  /* Notification */

  const handleNotificationClose = () => {
    setWasNotified(true);
  };

  const handleCalendarPreviousClick = () => {
    const now = currentDate;

    if (viewMode === "daily") {
      setCurrentDate(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      );
    }

    if (
      viewMode === "weekly" ||
      (viewMode === "daily" &&
        (now.getDay() === 0 ||
          now.getDate() <
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 1,
            ).getDate()))
    ) {
      if (currentWeek <= 0) {
        const previousMonthLastDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
        );

        if (viewMode === "weekly")
          setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 0));

        setCurrentWeek(
          (new Date(now.getFullYear(), now.getMonth() - 1).getDay() +
            previousMonthLastDay.getDate() +
            6 -
            previousMonthLastDay.getDay()) /
            7 -
            1,
        );
      } else {
        if (viewMode === "weekly")
          setCurrentDate(
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 7 + (6 - now.getDay()),
            ),
          );

        setCurrentWeek((currentWeek) => currentWeek - 1);
      }
    }

    if (viewMode === "monthly") {
      let updatedDate = new Date(now.getFullYear(), now.getMonth() - 1);

      if (
        today.getFullYear() === updatedDate.getFullYear() &&
        today.getMonth() === updatedDate.getMonth()
      ) {
        setCurrentWeek(
          (updatedDate.getDay() + today.getDate() + 6 - today.getDay()) / 7 - 1,
        );

        setCurrentDate(today);
      } else {
        const previousMonthLastDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
        );

        setCurrentWeek(
          (updatedDate.getDay() +
            previousMonthLastDay.getDate() +
            6 -
            previousMonthLastDay.getDay()) /
            7 -
            1,
        );

        setCurrentDate(previousMonthLastDay);
      }
    }
  };

  const handleCalendarNextClick = () => {
    const now = currentDate;

    if (viewMode === "daily") {
      setCurrentDate(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
      );
    }

    if (
      viewMode === "weekly" ||
      (viewMode === "daily" &&
        (now.getDay() === 6 ||
          now.getDate() >
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1,
            ).getDate()))
    ) {
      if (currentWeek >= weeksArray[weeksArray.length - 1]) {
        if (viewMode === "weekly")
          setCurrentDate(new Date(now.getFullYear(), now.getMonth() + 1, 1));

        setCurrentWeek(0);
      } else {
        if (viewMode === "weekly")
          setCurrentDate(
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 7 - now.getDay(),
            ),
          );

        setCurrentWeek((currentWeek) => currentWeek + 1);
      }
    }

    if (viewMode === "monthly") {
      let updatedDate = new Date(now.getFullYear(), now.getMonth() + 1);

      if (
        today.getFullYear() === updatedDate.getFullYear() &&
        today.getMonth() === updatedDate.getMonth()
      ) {
        setCurrentWeek(
          (updatedDate.getDay() + today.getDate() + 6 - today.getDay()) / 7 - 1,
        );

        setCurrentDate(today);
      } else {
        setCurrentWeek(0);

        setCurrentDate(updatedDate);
      }
    }
  };

  return (
    <>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarControls}>
          <div className={styles.changeMonth}>
            <Button
              className={`${styles.previousMonth} ${stylesButton.iconButton}`}
              onClick={handleCalendarPreviousClick}
            >
              <FiChevronLeft size="0.875rem" />
            </Button>

            <h2 className={styles.currentMonth}>
              {formatDateToDisplay1(currentDate)}
            </h2>

            <Button
              className={`${styles.nextMonth} ${stylesButton.iconButton}`}
              onClick={handleCalendarNextClick}
            >
              <FiChevronRight size="0.875rem" />
            </Button>
          </div>

          <div className={`${styles.changeViewMode} ${styles[viewMode]}`}>
            <Button
              className={styles.viewModeOption}
              onClick={() => setViewMode("daily")}
            >
              Diária
            </Button>
            <Button
              className={styles.viewModeOption}
              onClick={() => setViewMode("weekly")}
            >
              Semanal
            </Button>
            <Button
              className={styles.viewModeOption}
              onClick={() => setViewMode("monthly")}
            >
              Mensal
            </Button>
          </div>
        </div>

        <table
          className={`${styles.table} ${
            viewMode === "daily" ? styles.dailyMode : ""
          }`}
        >
          <thead>
            <tr>
              {viewMode !== "daily" ? (
                weekDays.map((weekDay, index) => {
                  return <th key={index}>{weekDay}</th>;
                })
              ) : (
                <th>{weekDays[currentDate.getDay()]}</th>
              )}
            </tr>
          </thead>

          <tbody>
            {weeksArray.map((week) => {
              if (viewMode !== "monthly" && week !== currentWeek) return null;
              return (
                <tr key={week}>
                  {monthDaysArray
                    .slice(week * 7, week * 7 + 7)
                    .map((day, index) => {
                      const now = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day,
                      );
                      const nowFormatted = formatDateToInput(now);

                      const unscheduledEventsForNow = unscheduledEvents.filter(
                        (event) => {
                          return event.possibleDates.some(({ date }) => {
                            return date === nowFormatted;
                          });
                        },
                      );

                      const scheduledEventsForNow = scheduledEvents.filter(
                        (event) => {
                          return event.scheduledDates.some(({ date }) => {
                            return date === nowFormatted;
                          });
                        },
                      );

                      const allEventsForNow = [
                        ...unscheduledEventsForNow,
                        ...scheduledEventsForNow,
                      ];

                      if (viewMode === "daily" && day !== currentDate.getDate())
                        return null;
                      return (
                        <td
                          key={index}
                          className={`${styles.td} ${
                            day === 0 ? styles.unavailableDay : ""
                          } ${
                            now.getFullYear() === today.getFullYear() &&
                            now.getMonth() === today.getMonth() &&
                            now.getDate() === today.getDate()
                              ? styles.today
                              : ""
                          }`}
                        >
                          <span className={styles.dayNumber}>{day || ""}</span>

                          {day !== 0 &&
                            allEventsForNow
                              .slice(
                                0,
                                viewMode === "daily"
                                  ? allEventsForNow.length
                                  : 3,
                              )
                              .map((event, index) => {
                                return (
                                  <Link
                                    key={index}
                                    to={`/schedule/event/show/${event.name}`}
                                    className={`${styles.event} ${
                                      index < unscheduledEventsForNow.length
                                        ? styles.unscheduled
                                        : styles.scheduled
                                    }`}
                                  >
                                    {event.name}
                                  </Link>
                                );
                              })}

                          {day !== 0 && allEventsForNow.length > 3 ? (
                            <button
                              className={styles.more}
                              onClick={() => {
                                setViewMode("daily");
                                setCurrentDate(now);
                                setCurrentWeek(
                                  (new Date(
                                    today.getFullYear(),
                                    today.getMonth(),
                                  ).getDay() +
                                    now.getDate() +
                                    6 -
                                    now.getDay()) /
                                    7 -
                                    1,
                                );
                              }}
                            >
                              <FiMoreHorizontal size="0.75rem" />
                            </button>
                          ) : null}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpened={isLogged && !wasLoggedWithAutoLogin && !wasNotified}
        onModalClose={handleNotificationClose}
        title={`Olá ${loggedUser}!`}
      >
        <div className={styles.notificationContainer}>
          <h2 className={styles.notificationSubTitle}>
            {isNewAccount ? "Seja bem-vindo!" : "Próximos eventos"}
          </h2>

          {isNewAccount ? (
            <p className={stylesModal.message}>
              O MeetMe é um aplicativo onde você pode criar eventos e
              compartilhá-los com seus amigos para decidirem qual as melhores
              datas para eles :)
            </p>
          ) : scheduledEventsForNextThreeDays.length ? (
            <ul className={styles.notificationDaysList}>
              {nextThreeDays.map((formattedDate) => {
                const eventsForNow = scheduledEventsForNextThreeDays.filter(
                  (event) => {
                    return event.scheduledDates.some(({ date }) => {
                      return date === formattedDate;
                    });
                  },
                );

                if (!eventsForNow.length) {
                  return null;
                }

                return (
                  <li
                    key={formattedDate}
                    className={styles.notificationDaysListItem}
                  >
                    <span className={styles.dayNumber}>
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "numeric",
                        month: "numeric",
                      }).format(datePlusTimezoneOffset(formattedDate))}
                    </span>

                    {eventsForNow.map((event, index) => {
                      return (
                        <Link
                          key={index}
                          to={`/schedule/event/show/${event.name}`}
                          className={`${styles.event} ${styles.scheduled}`}
                        >
                          {event.name}
                        </Link>
                      );
                    })}

                    {/* Apenas de enfeite, tamanho perfeito para um `padding-bottom` */}
                    <button className={styles.more} onClick={() => {}}>
                      <FiMoreHorizontal size="0.75rem" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={stylesModal.message}>
              Fique tranquilo! Não há eventos agendados para os próximos três
              dias :)
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Schedule;
