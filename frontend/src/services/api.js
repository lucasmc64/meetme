const API_URL = "http://localhost:8080";

export function LOGIN(body) {
  return {
    url: `${API_URL}/login`,
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function AUTO_LOGIN(username) {
  return {
    url: `${API_URL}/login/${username}`,
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    },
  };
}

export function GET_ALL_ACCOUNTS_USERNAMES() {
  return {
    url: `${API_URL}/users`,
    options: {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  };
}

export function CREATE_EVENT(username, body) {
  return {
    url: `${API_URL}/users/${username}/schedule/event/create`,
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function GET_SCHEDULE(username) {
  return {
    url: `${API_URL}/users/${username}/schedule`,
    options: {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  };
}

export function DELETE_EVENT(username, eventName) {
  return {
    url: `${API_URL}/users/${username}/schedule/event/delete/${eventName}`,
    options: {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    },
  };
}

export function UPDATE_EVENT(username, eventName, isScheduled, body) {
  return {
    url: `${API_URL}/users/${username}/schedule/${
      isScheduled ? "scheduled" : "unscheduled"
    }Events/event/update/${eventName}`,
    options: {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function SCHEDULE_EVENT(username, eventName, body) {
  return {
    url: `${API_URL}/users/${username}/schedule/event/toSchedule/${eventName}`,
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function GET_ALL_POSSIBLE_DATES(eventName, body) {
  return {
    url: `${API_URL}/users/schedule/event/timetables/${eventName}`,
    options: {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}
