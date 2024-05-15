export function getWeekendDates(start: Date, end: Date) {
  const tempWeekendDates: Date[] = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    if (isWeekend(currentDate)) {
      tempWeekendDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tempWeekendDates;
}

export function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const years = Array.from({ length: 100 }, (_, i) => i + 2000);
