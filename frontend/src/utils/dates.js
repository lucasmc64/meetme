function datePlusTimezoneOffset(date) {
  let newDate = new Date(date);

  newDate.setTime(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);

  return newDate;
}

function formatDateToDisplay1(date) {
  const correctedDate = datePlusTimezoneOffset(date);

  const month = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(correctedDate);

  const year = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
  }).format(correctedDate);

  return `${month}, ${year}`;
}

function formatDateToDisplay2(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(datePlusTimezoneOffset(date));
}

function formatHourToDisplay(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getMonthDaysArray(currentYear, currentMonth) {
  let currentDate = new Date(currentYear, currentMonth, 1);
  let whereMonthStartsOnWeek = currentDate.getDay();
  let monthDays = [];

  for (let i = 0; i < whereMonthStartsOnWeek; i++) {
    monthDays.push(0);
  }

  for (
    let i = 0;
    i <
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    i++
  ) {
    monthDays.push(i + 1);
  }

  while (monthDays.length % 7 !== 0) {
    monthDays.push(0);
  }

  return monthDays;
}

function getWeek(date) {
  const currentDate = new Date(date);

  if (currentDate.getDate() === 1) return 0;

  const firstDayOfCurrentWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay(),
  );

  if (firstDayOfCurrentWeek.getMonth() < currentDate.getMonth()) return 0;

  return (
    (firstDayOfCurrentWeek.getDate() -
      1 +
      7 -
      ((firstDayOfCurrentWeek.getDate() - 1) % 7)) /
    7
  );
}

function formatDateToInput(date) {
  const newDate = new Date(date);

  return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(newDate.getDate()).padStart(2, "0")}`;
}

export {
  getMonthDaysArray,
  formatDateToDisplay1,
  formatDateToDisplay2,
  formatDateToInput,
  getWeek,
  formatHourToDisplay,
  datePlusTimezoneOffset,
};
