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
  date.getDay() === 0 || date.getDay() === 6;
}
