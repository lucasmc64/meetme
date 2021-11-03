import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";

import {
  CREATE_EVENT,
  DELETE_EVENT,
  GET_ALL_ACCOUNTS_USERNAMES,
  SCHEDULE_EVENT,
  UPDATE_EVENT,
} from "../services/api";

import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import Select from "../components/Select";

import Toast from "../helpers/Toast";

import { EventContext } from "../contexts/EventContext";
import { ScheduleContext } from "../contexts/ScheduleContext";
import { UserContext } from "../contexts/UserContext";

import {
  formatDateToDisplay2,
  formatDateToInput,
  formatHourToDisplay,
  datePlusTimezoneOffset,
} from "../utils/dates";

import Modal from "../components/Modal";
import ScheduleOverlap from "../components/ScheduleOverlap";

import styles from "../styles/pages/Event.module.css";
import stylesButton from "../styles/components/Button.module.css";
import stylesModal from "../styles/components/Modal.module.css";

const Event = () => {
  const { loggedUser } = useContext(UserContext);
  const { schedule, setSchedule } = useContext(ScheduleContext);
  const {
    event,
    setEvent,
    eventFromServer,
    setEventFromServer,
    isScheduled,
    setIsScheduled,
  } = useContext(EventContext);

  const refs = {
    name: useRef(),
    description: useRef(),
    chosenDateInput: useRef(),
    addChosenDate: useRef(),
    guestInput: useRef(),
    addGuest: useRef(),
    selectedDateInput: useRef(),
    from: useRef(),
    to: useRef(),
    addTimetable: useRef(),
    subLists: useRef([]),
  };

  const [allUsernames, setAllUsernames] = useState(null);

  const [chosenDate, setChosenDate] = useState("");
  const [chosenGuest, setChosenGuest] = useState("");
  const [timetable, setTimetable] = useState({
    from: "",
    to: "",
  });
  const [selectedDate, setSelectedDate] = useState("");

  const [isDeleteModalOpened, setDeleteModalOpened] = useState(false);
  const [notExistsModalOpened, setNotExistsModalOpened] = useState(false);

  const history = useHistory();

  const { name: eventName } = useParams();

  /* Carga inicial de dados */

  useEffect(() => {
    setChosenDate("");
    setChosenGuest("");
    setTimetable({
      from: "",
      to: "",
    });
    setSelectedDate("");

    if (!eventName) {
      setEvent({
        name: "",
        description: "",
        dates: [],
        guests: [],
      });
      setIsScheduled(false);
      setEventFromServer(null);
    } else {
      let newEvent, newIsScheduled;

      newEvent =
        schedule?.scheduledEvents.find((event) => {
          if (event.name === eventName) {
            newIsScheduled = true;

            return true;
          }

          return false;
        }) ??
        schedule?.unscheduledEvents.find((event) => {
          if (event.name === eventName) {
            newIsScheduled = false;

            return true;
          }

          return false;
        });

      if (!newEvent) {
        setNotExistsModalOpened(true);
        return false;
      }

      setNotExistsModalOpened(false);

      setIsScheduled(newIsScheduled);
      setEvent({
        name: newEvent.name.slice(
          0,
          newEvent.name.indexOf(` - ${newEvent.host}`),
        ),
        description: newEvent.description,
        dates: newIsScheduled
          ? newEvent.scheduledDates
          : newEvent.possibleDates,
        guests: newEvent.guests,
        host: newEvent.host,
      });

      setEventFromServer(newEvent);
    }
  }, [eventName, schedule]);

  /* Buscando possíveis convidados */

  useEffect(() => {
    async function getAllAccountsUsernames() {
      try {
        const { url, options } = GET_ALL_ACCOUNTS_USERNAMES();
        const response = await fetch(url, options);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.message);

        setAllUsernames(json.data);
      } catch (error) {
        console.error(
          "Falha no buscar todos os nomes de usuários: " + error.message,
        );
      }
    }

    getAllAccountsUsernames();
  }, []);

  /* Estados internos */

  const handleDateChange = ({ target: { value } }) => {
    refs.chosenDateInput.current.classList.remove("error");
    setChosenDate(value);
  };

  const handleGuestChange = ({ target: { value } }) => {
    refs.guestInput.current.classList.remove("error");
    setChosenGuest(value);
  };

  const handleSelectedDateChange = ({ target: { value } }) => {
    refs.selectedDateInput.current.classList.remove("error");
    setSelectedDate(value);
  };

  const handleTimetableChange = ({ target: { name, value } }) => {
    refs[name].current.classList.remove("error");
    setTimetable((timetable) => ({ ...timetable, [name]: value }));
  };

  /* Estados externos */

  const validateField = (
    field,
    errorMessage = "Este campo deve conter no mínimo 3 caracteres.",
  ) => {
    if (event[field].trim().length >= 3) return true;

    refs[field].current.classList.add("error");

    Toast.fire({
      icon: "error",
      title: errorMessage,
    });

    return false;
  };

  const handleTextFieldChange = ({ target: { name, value } }) => {
    refs[name].current.classList.remove("error");

    setEvent((event) => ({ ...event, [name]: value }));
  };

  const handleAddDate = () => {
    const newDate = chosenDate;

    setChosenDate("");

    if (!newDate) {
      Toast.fire({
        icon: "error",
        title: "Nenhuma data selecionada para adicionar ao evento.",
      });

      return false;
    }

    if (datePlusTimezoneOffset(newDate) <= new Date()) {
      Toast.fire({
        icon: "error",
        title: "Impossível adicionar eventos em datas já passadas.",
      });

      return false;
    }

    if (event.dates.some(({ date }) => date === newDate)) {
      Toast.fire({
        icon: "error",
        title: "Data selecionada já adicionada ao evento.",
      });

      return false;
    }

    refs.addChosenDate.current.classList.remove("error");

    setEvent((event) => ({
      ...event,
      dates: [...event.dates, { date: newDate, timetables: [] }].sort(
        ({ date: currentDate }, { date: nextDate }) =>
          new Date(currentDate) - new Date(nextDate),
      ),
    }));

    return true;
  };

  const handleDeleteDate = (event) => {
    if (!event.target.closest("button")) return false;

    const removedDate = event.target.closest("button").dataset.date;

    if (!removedDate) return false;

    if (removedDate === selectedDate) setSelectedDate("");

    setEvent((event) => ({
      ...event,
      dates: event.dates.filter((data) => data.date !== removedDate),
    }));
  };

  const handleAddGuest = () => {
    const newGuest = chosenGuest;

    setChosenGuest("");

    if (!newGuest) {
      Toast.fire({
        icon: "error",
        title: "Nenhum convidado informado para adicionar ao evento.",
      });

      if (!event.guests.length) {
        refs.guestInput.current.classList.add("error");
        refs.addGuest.current.classList.add("error");
      }

      return false;
    }

    if (!allUsernames?.includes(newGuest)) {
      Toast.fire({
        icon: "error",
        title: "Convidado informado não existe no sistema.",
      });

      if (!event.guests.length) {
        refs.guestInput.current.classList.add("error");
        refs.addGuest.current.classList.add("error");
      }

      return false;
    }

    if (event.guests.includes(newGuest)) {
      Toast.fire({
        icon: "error",
        title: "Convidado informado já adicionado ao evento.",
      });

      return false;
    }

    refs.guestInput.current.classList.remove("error");
    refs.addGuest.current.classList.remove("error");

    setEvent((event) => ({
      ...event,
      guests: [...event.guests, newGuest],
    }));

    return true;
  };

  const handleDeleteGuest = (event) => {
    if (!event.target.closest("button")) return false;

    const removedGuest = event.target.closest("button").dataset.guest;

    if (!removedGuest) return false;

    setEvent((event) => ({
      ...event,
      guests: event.guests.filter((guest) => guest !== removedGuest),
    }));
  };

  const handleAddTimetable = () => {
    /* Verificações da data selecionada */

    if (!selectedDate) {
      Toast.fire({
        icon: "error",
        title: "Nenhuma data selecionada para adicionar um horário ao evento.",
      });

      return false;
    }

    if (!event.dates.some(({ date }) => date === selectedDate)) {
      Toast.fire({
        icon: "error",
        title: "Data selecionada não foi adicionada ao evento.",
      });

      setSelectedDate("");

      return false;
    }

    /* Verificações dos horários escolhidos */

    if (!timetable.from) {
      Toast.fire({
        icon: "error",
        title: "Nenhuma hora de início escolhida para adicionar um horário.",
      });

      return false;
    }

    if (!timetable.to) {
      Toast.fire({
        icon: "error",
        title: "Nenhuma hora de fim escolhida para adicionar um horário.",
      });

      return false;
    }

    /* Verificações da validade horários escolhidos */

    const newDateFrom = new Date(`${selectedDate} ${timetable.from}`);
    const newDateTo = new Date(`${selectedDate} ${timetable.to}`);

    if (newDateFrom >= newDateTo) {
      Toast.fire({
        icon: "error",
        title: "Hora de início não pode ser maior ou igual que a hora de fim.",
      });

      return false;
    }

    const hasTimetablesConflicts = !event.dates
      .find(({ date }) => {
        return date === selectedDate;
      })
      .timetables.every(({ from, to }) => {
        const dateFrom = new Date(`${selectedDate} ${from}`);
        const dateTo = new Date(`${selectedDate} ${to}`);

        return newDateFrom >= dateTo || newDateTo <= dateFrom;
      });

    if (hasTimetablesConflicts) {
      Toast.fire({
        icon: "error",
        title:
          "Horário selecionado conflita com outro horário já adicionado ao evento.",
      });

      setTimetable({ from: "", to: "" });

      return false;
    }

    /* Reset */

    refs.subLists.current
      .find((sublist) => {
        return sublist.classList.contains(styles.sublistError);
      })
      ?.classList.remove(styles.sublistError);

    refs.selectedDateInput.current.classList.remove("error");
    refs.from.current.classList.remove("error");
    refs.to.current.classList.remove("error");
    refs.addTimetable.current.classList.remove("error");

    const oldTimetables = event.dates.find(
      ({ date }) => date === selectedDate,
    ).timetables;

    setEvent((event) => ({
      ...event,
      dates: event.dates.map(({ date, timetables }) => {
        if (selectedDate !== date) return { date, timetables };

        return {
          date,
          timetables: [...oldTimetables, timetable],
        };
      }),
    }));

    /* Resetando inputs */

    setSelectedDate("");
    setTimetable({
      from: "",
      to: "",
    });

    return true;
  };

  const handleDeleteTimetable = ({ target }) => {
    if (!target.closest("button")) return false;

    const listDate = target.closest("button").dataset.date;
    const removedFrom = target.closest("button").dataset.from;
    const removedTo = target.closest("button").dataset.to;

    if (!listDate || !removedFrom || !removedTo) return false;

    setEvent((event) => ({
      ...event,
      dates: event.dates.map(({ date, timetables }) => {
        if (listDate !== date) return { date, timetables };

        return {
          date,
          timetables: timetables.filter(({ from, to }) => {
            return from !== removedFrom && to !== removedTo;
          }),
        };
      }),
    }));
  };

  const handleButtonDeleteClick = () => {
    setDeleteModalOpened(true);
  };

  const validateAllFields = () => {
    if (
      !validateField(
        "name",
        "O nome do evento deve conter no mínimo 3 caracteres.",
      )
    )
      return false;

    if (
      !validateField(
        "description",
        "A descrição do evento deve conter no mínimo 3 caracteres.",
      )
    )
      return false;

    if (event.dates.length === 0) {
      refs.chosenDateInput.current.classList.add("error");
      refs.addChosenDate.current.classList.add("error");

      Toast.fire({
        icon: "error",
        title: "Nenhuma data adicionada ao evento.",
      });

      return false;
    }

    if (event.guests.length === 0) {
      refs.guestInput.current.classList.add("error");
      refs.addGuest.current.classList.add("error");

      Toast.fire({
        icon: "error",
        title: "Nenhum convidado adicionado ao evento.",
      });

      return false;
    }

    const dateWithoutTimetables = event.dates.find(
      ({ timetables }) => timetables.length === 0,
    );

    if (dateWithoutTimetables !== undefined) {
      refs.subLists.current
        .find((sublist) => {
          return sublist.dataset.date === dateWithoutTimetables.date;
        })
        .classList.add(styles.sublistError);

      refs.selectedDateInput.current.classList.add("error");
      refs.from.current.classList.add("error");
      refs.to.current.classList.add("error");
      refs.addTimetable.current.classList.add("error");

      Toast.fire({
        icon: "error",
        title: "Existe uma data que não possui horários relativos a ela.",
      });

      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  /* Enviando para o backend */

  const handleCreateEvent = async () => {
    if (!validateAllFields()) return false;

    try {
      const bodyHost = {
        name: `${event.name} - ${loggedUser}`,
        description: event.description,
        host: loggedUser,
        possibleDates: event.dates,
        guests: event.guests,
      };

      const bodyGuest = {
        ...bodyHost,
        possibleDates: bodyHost.possibleDates.map(({ date }) => {
          return { date, timetables: [] };
        }),
      };

      const { url, options } = CREATE_EVENT(loggedUser, bodyHost);
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok || !json.ok) throw new Error(json.message);

      setSchedule((schedule) => {
        return {
          ...schedule,
          unscheduledEvents: [...schedule.unscheduledEvents, bodyHost],
        };
      });

      const eventPromises = event.guests.map((guest) => {
        const { url, options } = CREATE_EVENT(guest, bodyGuest);

        return fetch(url, options);
      });

      const responses = await Promise.all(eventPromises);

      responses.forEach((response) => {
        if (!response.ok)
          throw new Error(`Erro ao criar evento. (${response.status})`);
      });

      const jsonsPromises = responses.map((response) => response.json());
      const jsons = await Promise.all(jsonsPromises);

      jsons.forEach((json) => {
        if (!json.ok) throw new Error(json.message);
      });

      Toast.fire({
        icon: "success",
        title: "Evento criado com sucesso!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message,
      });

      console.error(error);
    } finally {
      history.push("/schedule");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const { url, options } = DELETE_EVENT(loggedUser, eventFromServer.name);
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok || !json.ok) throw new Error(json.message);

      setSchedule((schedule) => {
        return {
          scheduledEvents: schedule.scheduledEvents.filter(
            ({ name }) => name !== eventFromServer.name,
          ),
          unscheduledEvents: schedule.unscheduledEvents.filter(
            ({ name }) => name !== eventFromServer.name,
          ),
        };
      });

      const eventPromises = eventFromServer.guests.map((guest) => {
        const { url, options } = DELETE_EVENT(guest, eventFromServer.name);

        return fetch(url, options);
      });

      const responses = await Promise.all(eventPromises);

      responses.forEach((response) => {
        if (!response.ok)
          throw new Error(`Erro ao deletar evento. (${response.status})`);
      });

      const jsonsPromises = responses.map((response) => response.json());
      const jsons = await Promise.all(jsonsPromises);

      jsons.forEach((json) => {
        if (!json.ok) throw new Error(json.message);
      });

      Toast.fire({
        icon: "success",
        title: "Evento deletado com sucesso!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message,
      });

      console.error(error);
    } finally {
      history.push("/schedule");
    }
  };

  const handleUpdateEvent = async () => {
    if (!validateAllFields()) return false;

    try {
      let body;

      body = {
        name: `${event.name} - ${eventFromServer.host}`,
        description: event.description,
        host: eventFromServer.host,
        [isScheduled ? "scheduledDates" : "possibleDates"]: event.dates,
        guests: event.guests,
      };

      const { url, options } = UPDATE_EVENT(
        loggedUser,
        eventFromServer.name,
        isScheduled,
        body,
      );
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok || !json.ok) throw new Error(json.message);
      setSchedule((schedule) => {
        return {
          ...schedule,
          [isScheduled ? "scheduledEvents" : "unscheduledEvents"]: [
            ...schedule[
              isScheduled ? "scheduledEvents" : "unscheduledEvents"
            ].filter((event) => event.name !== eventFromServer.name),
            body,
          ],
        };
      });

      if (loggedUser === eventFromServer.host) {
        if (isScheduled === false) {
          body = {
            ...body,
            [isScheduled ? "scheduledDates" : "possibleDates"]: body[
              isScheduled ? "scheduledDates" : "possibleDates"
            ].map(({ date }) => {
              return { date, timetables: [] };
            }),
          };
        }

        const eventPromises = event.guests.map((guest) => {
          const { url, options } = UPDATE_EVENT(
            guest,
            eventFromServer.name,
            isScheduled,
            body,
          );

          return fetch(url, options);
        });

        const responses = await Promise.all(eventPromises);

        responses.forEach((response) => {
          if (!response.ok)
            throw new Error(
              `Erro ao ${
                isScheduled !== null ? "atualizar" : "criar"
              } evento. (${response.status})`,
            );
        });

        const jsonsPromises = responses.map((response) => response.json());
        const jsons = await Promise.all(jsonsPromises);

        jsons.forEach((json) => {
          if (!json.ok) throw new Error(json.message);
        });
      }

      Toast.fire({
        icon: "success",
        title: `Evento ${
          isScheduled !== null ? "atualizado" : "criado"
        } com sucesso!`,
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message,
      });

      console.error(error);
    } finally {
      history.push("/schedule");
    }
  };

  const handleToScheduleEvent = async () => {
    if (!validateAllFields()) return false;

    try {
      let body;

      body = {
        name: `${event.name} - ${eventFromServer.host}`,
        description: event.description,
        host: eventFromServer.host,
        scheduledDates: event.dates,
        guests: event.guests,
      };

      const { url, options } = SCHEDULE_EVENT(
        loggedUser,
        eventFromServer.name,
        body,
      );
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok || !json.ok) throw new Error(json.message);

      setSchedule((schedule) => {
        return {
          scheduledEvents: [...schedule.scheduledEvents, body],
          unscheduledEvents: schedule.unscheduledEvents.filter(({ name }) => {
            return name !== eventFromServer.name;
          }),
        };
      });

      const eventPromises = event.guests.map((guest) => {
        const { url, options } = SCHEDULE_EVENT(
          guest,
          eventFromServer.name,
          body,
        );

        return fetch(url, options);
      });

      const responses = await Promise.all(eventPromises);

      responses.forEach((response) => {
        if (!response.ok)
          throw new Error(`Erro ao agendar evento. (${response.status})`);
      });

      const jsonsPromises = responses.map((response) => response.json());
      const jsons = await Promise.all(jsonsPromises);

      jsons.forEach((json) => {
        if (!json.ok) throw new Error(json.message);
      });

      Toast.fire({
        icon: "success",
        title: "Evento agendado com sucesso!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message,
      });

      console.error(error);
    } finally {
      history.push("/schedule");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Detalhes do evento</legend>

            <Input
              label="Nome / Título"
              id="name"
              name="name"
              type="text"
              value={event.name}
              onChange={handleTextFieldChange}
              onBlur={({ target: { value } }) => {
                setEvent((event) => ({ ...event, name: value.trim() }));
                validateField(
                  "name",
                  "O nome do evento deve conter no mínimo 3 caracteres.",
                );
              }}
              ref={refs.name}
              disabled={eventName ? loggedUser !== event.host : false}
            />

            <Textarea
              label="Descrição"
              id="description"
              name="description"
              type="text"
              value={event.description}
              onChange={handleTextFieldChange}
              onBlur={({ target: { value } }) => {
                setEvent((event) => ({ ...event, description: value.trim() }));
                validateField(
                  "description",
                  "A descrição do evento deve conter no mínimo 3 caracteres.",
                );
              }}
              ref={refs.description}
              disabled={eventName ? loggedUser !== event.host : false}
            />

            <div className={styles.addContainer}>
              <Input
                label="Adicionar data"
                id="date"
                name="date"
                type="date"
                value={chosenDate}
                onChange={handleDateChange}
                min={formatDateToInput(
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate() + 1,
                  ),
                )}
                ref={refs.chosenDateInput}
                disabled={eventName ? loggedUser !== event.host : false}
              />

              <Button
                type="button"
                className={`${styles.addButton} ${stylesButton.iconButton}`}
                onClick={handleAddDate}
                ref={refs.addChosenDate}
                disabled={eventName ? loggedUser !== event.host : false}
              >
                <FiPlus size="0.875rem" />
              </Button>
            </div>

            <ul className={styles.list} onClick={handleDeleteDate}>
              {event.dates.length ? (
                event.dates.map((data) => {
                  return (
                    <li key={data.date} className={styles.listItem}>
                      <div className={styles.listContent}>
                        {formatDateToDisplay2(data.date)}
                      </div>

                      <div>
                        <Button
                          type="button"
                          className={`${styles.addButton} ${stylesButton.iconButton}`}
                          data-date={data.date}
                          disabled={
                            eventName ? loggedUser !== event.host : false
                          }
                        >
                          <FiX size="0.875rem" />
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className={styles.listItem}>
                  <div className={styles.listContent}>
                    Nenhuma data inserida...
                  </div>
                </li>
              )}
            </ul>

            <div className={styles.addContainer}>
              <Input
                label="Adicionar convidado"
                type="text"
                value={chosenGuest}
                onChange={handleGuestChange}
                list="guestsSuggestions"
                disabled={
                  allUsernames?.length <= 1 || eventName
                    ? loggedUser !== event.host
                    : false
                }
                ref={refs.guestInput}
              />

              <datalist id="guestsSuggestions">
                {allUsernames?.map((username) => {
                  if (username === loggedUser) return null;

                  return <option key={username} value={username} />;
                })}
              </datalist>

              <Button
                type="button"
                className={`${styles.addButton} ${stylesButton.iconButton}`}
                onClick={handleAddGuest}
                ref={refs.addGuest}
                disabled={
                  allUsernames?.length <= 1 || eventName
                    ? loggedUser !== event.host
                    : false
                }
              >
                <FiPlus size="0.875rem" />
              </Button>
            </div>

            <ul className={styles.list} onClick={handleDeleteGuest}>
              {event.guests.length ? (
                event.guests.map((guestUsername) => {
                  return (
                    <li key={guestUsername} className={styles.listItem}>
                      <div className={styles.listContent}>{guestUsername}</div>

                      <div>
                        <Button
                          type="button"
                          className={`${styles.addButton} ${stylesButton.iconButton}`}
                          data-guest={guestUsername}
                          disabled={
                            eventName ? loggedUser !== event.host : false
                          }
                        >
                          <FiX size="0.875rem" />
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : allUsernames?.length > 1 ? (
                <li className={styles.listItem}>
                  <div className={styles.listContent}>
                    Nenhum convidado adicionado...
                  </div>
                </li>
              ) : (
                <li className={styles.listItem}>
                  <div className={styles.listContent}>
                    Nenhum outro usuário cadastrado no sistema.
                  </div>
                </li>
              )}
            </ul>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Sugestões de horários</legend>

            <div className={styles.addContainer}>
              <Select
                label="Data"
                id="selectedDate"
                name="selectedDate"
                selectDefaultText="Selecione uma data..."
                value={selectedDate}
                options={event.dates.map(({ date }) => ({
                  value: date,
                  label: formatDateToDisplay2(date),
                }))}
                onChange={handleSelectedDateChange}
                ref={refs.selectedDateInput}
                disabled={isScheduled ? loggedUser !== event.host : false}
              />
            </div>

            <div className={styles.addContainer}>
              <Input
                label="De"
                id="from"
                name="from"
                type="time"
                value={timetable.from}
                onChange={handleTimetableChange}
                ref={refs.from}
                disabled={isScheduled ? loggedUser !== event.host : false}
              />

              <Input
                label="Até"
                id="to"
                name="to"
                type="time"
                value={timetable.to}
                onChange={handleTimetableChange}
                ref={refs.to}
                disabled={isScheduled ? loggedUser !== event.host : false}
              />

              <Button
                type="button"
                className={`${styles.addButton} ${stylesButton.iconButton}`}
                onClick={handleAddTimetable}
                ref={refs.addTimetable}
                disabled={isScheduled ? loggedUser !== event.host : false}
              >
                <FiPlus size="0.875rem" />
              </Button>
            </div>

            <ul
              className={`${styles.list} ${styles.listOfSublists}`}
              onClick={handleDeleteTimetable}
            >
              {event.dates.length ? (
                event.dates.map(({ date, timetables }, index) => {
                  refs.subLists.current = [];

                  return (
                    <li key={date} className={styles.listItem}>
                      <ul
                        data-date={date}
                        className={`${styles.list} ${styles.sublist}`}
                        ref={(element) =>
                          (refs.subLists.current[index] = element)
                        }
                      >
                        <span className={`label ${styles.sublistLabel}`}>
                          {formatDateToDisplay2(date)}
                        </span>

                        {timetables.length ? (
                          timetables.map(({ from, to }, index) => {
                            return (
                              <li key={index} className={styles.listItem}>
                                <div className={styles.listContent}>
                                  {`${formatHourToDisplay(
                                    `${date} ${from}`,
                                  )} -  ${formatHourToDisplay(
                                    `${date} ${to}`,
                                  )}`}
                                </div>

                                <div>
                                  <Button
                                    type="button"
                                    className={`${styles.addButton} ${stylesButton.iconButton}`}
                                    data-date={date}
                                    data-from={from}
                                    data-to={to}
                                    disabled={
                                      isScheduled
                                        ? loggedUser !== event.host
                                        : false
                                    }
                                  >
                                    <FiX size="0.875rem" />
                                  </Button>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <li className={styles.listItem}>
                            <div className={styles.listContent}>
                              Nenhum horário inserido...
                            </div>
                          </li>
                        )}
                      </ul>
                    </li>
                  );
                })
              ) : (
                <li className={styles.listItem}>
                  <div className={styles.listContent}>
                    Nenhuma data e horário inseridos...
                  </div>
                </li>
              )}
            </ul>
          </fieldset>
        </form>

        {isScheduled === false && eventFromServer ? (
          <ScheduleOverlap event={eventFromServer} />
        ) : null}

        <div className={styles.actions}>
          {loggedUser === eventFromServer?.host ? (
            <Button
              className={stylesButton.deleteButton}
              onClick={handleButtonDeleteClick}
            >
              Deletar
            </Button>
          ) : null}

          {eventName &&
          (isScheduled === false || loggedUser === eventFromServer?.host) ? (
            <Button
              className={stylesButton.primaryButton}
              onClick={handleUpdateEvent}
            >
              Atualizar
            </Button>
          ) : null}

          {!eventName ? (
            <Button
              className={stylesButton.primaryButton}
              onClick={handleCreateEvent}
            >
              Criar
            </Button>
          ) : null}

          {isScheduled === false && loggedUser === eventFromServer?.host ? (
            <Button
              className={`${stylesButton.primaryButton} ${stylesButton.specialButton}`}
              onClick={handleToScheduleEvent}
            >
              Agendar
            </Button>
          ) : null}
        </div>
      </div>

      <Modal
        title="Ooops!"
        isOpened={allUsernames?.length <= 1}
        onModalClose={() => {
          document.body.classList.remove("block-scroll");
          history.push("/schedule");
        }}
        headerClassName={styles.deleteHeader}
      >
        <p className={stylesModal.message}>
          Impossível criar um evento sem convidados e nenhum outro usuário
          cadastrado no sistema foi detectado.
          <br />
          Redirecionando para a agenda...
        </p>
      </Modal>

      <Modal
        title="Calma lá... "
        isOpened={isDeleteModalOpened}
        setIsModalOpened={setDeleteModalOpened}
        onConfirmClick={async () => {
          await handleDeleteEvent();
          history.push("/schedule");
        }}
        confirmButtonText="Sim, delete!"
        confirmButtonClassName={stylesButton.deleteButton}
        headerClassName={styles.deleteHeader}
        showCancelButton={true}
      >
        <p className={stylesModal.message}>
          Deseja realmente deletar este evento?
          <br />
          Esta ação não poderá ser desfeita.
        </p>
      </Modal>

      <Modal
        title="Ooops!"
        isOpened={notExistsModalOpened}
        onModalClose={() => {
          document.body.classList.remove("block-scroll");
          history.push("/schedule");
        }}
        headerClassName={styles.deleteHeader}
      >
        <p className={stylesModal.message}>
          Você está tentando acessar um evento que não existe :(
          <br />
          Redirecionando para a agenda...
        </p>
      </Modal>
    </>
  );
};

export default Event;
