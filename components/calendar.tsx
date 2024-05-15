"use client";
import { getDaysInMonth, isWeekend } from "@/utils/utils";
import { DateRange, WeekendDates } from "@/utils/types";

interface CalendarProps {
  month: number;
  year: number;
  dateRange: DateRange;
  weekendDates: WeekendDates;
  onDateClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  month,
  year,
  dateRange,
  weekendDates,
  onDateClick,
}) => {
  const isDateInRange = (date: Date) => {
    const { startDate, endDate } = dateRange;
    return startDate && endDate && date >= startDate && date <= endDate;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarRows = [];

    let date = 1;
    for (let row = 0; row < 6; row++) {
      const calendarCells = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDayOfMonth) {
          calendarCells.push(
            <div
              key={`empty-${col}`}
              className="text-gray-400 p-2 text-center"
            ></div>
          );
        } else if (date > daysInMonth) {
          calendarCells.push(
            <div
              key={`empty-${col}`}
              className="text-gray-400 p-2 text-center"
            ></div>
          );
        } else {
          const currentDate = new Date(year, month, date);
          const isWeekendDay = isWeekend(currentDate);

          const isSelectedDay = isDateInRange(currentDate) && !isWeekendDay;
          const isStartOrEndDate =
            (currentDate.getTime() === dateRange.startDate?.getTime() ||
              currentDate.getTime() === dateRange.endDate?.getTime()) &&
            !isWeekendDay;

          calendarCells.push(
            <button
              key={date}
              className={`p-2 cursor-pointer text-center hover:bg-blue-200 hover:bg-opacity-20 ease-in-out transition-all duration-300 ${
                isWeekendDay ? "text-gray-500" : "text-white"
              } ${isSelectedDay ? "bg-blue-200 bg-opacity-20" : ""} ${
                isStartOrEndDate
                  ? "bg-blue-500 rounded-sm text-white outline outline-sky-500"
                  : ""
              }`}
              onClick={() => onDateClick(currentDate)}
            >
              {date}
            </button>
          );
          date++;
        }
      }
      calendarRows.push(
        <div key={row} className="grid grid-cols-7">
          {calendarCells}
        </div>
      );
    }
    return calendarRows;
  };

  return <div className="space-y-1">{renderCalendar()}</div>;
};

export default Calendar;
