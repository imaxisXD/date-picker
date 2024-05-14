"use client";
import { useState } from "react";
import { DateRange, DateRangePickerProps, WeekendDates } from "@/utils/types";
import { getDaysInMonth, getWeekendDates, isWeekend } from "@/utils/utils";

const DatePicker: React.FC<DateRangePickerProps> = ({ predefinedRanges }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [weekendDates, setWeekendDates] = useState<WeekendDates>({
    weekendDates: [],
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const isDateInRange = (date: Date) => {
    const { startDate, endDate } = dateRange;
    return startDate && endDate && date >= startDate && date <= endDate;
  };

  const handleDateClick = (date: Date) => {
    if (!isWeekend(date)) {
      if (!dateRange.startDate) {
        setDateRange({ startDate: date, endDate: null });
      } else if (!dateRange.endDate) {
        const endDate = date > dateRange.startDate ? date : dateRange.startDate;
        const startDate =
          date < dateRange.startDate ? date : dateRange.startDate;
        setDateRange({ startDate, endDate });
        setWeekendDates({ weekendDates: getWeekendDates(startDate, endDate) });
      } else {
        setDateRange({ startDate: date, endDate: null });
        setWeekendDates({ weekendDates: [] });
      }
    }
  };

  const handlePredefinedRangeClick = (range: DateRange) => {
    const { startDate, endDate } = range;
    setDateRange({ startDate, endDate });
    if (startDate && endDate)
      setWeekendDates({ weekendDates: getWeekendDates(startDate, endDate) });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
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
          const currentDate = new Date(currentYear, currentMonth, date);
          const isWeekendDay = isWeekend(currentDate);

          const isSelectedDay = isDateInRange(currentDate) && !isWeekendDay;
          const isStartOrEndDate =
            (currentDate.getTime() === dateRange.startDate?.getTime() ||
              currentDate.getTime() === dateRange.endDate?.getTime()) &&
            !isWeekendDay;

          calendarCells.push(
            <button
              key={date}
              className={`p-2 cursor-pointer text-center ${
                isWeekendDay ? "text-gray-500" : "text-white"
              } ${isSelectedDay ? "bg-blue-200" : ""} ${
                isStartOrEndDate
                  ? "bg-blue-500 rounded-sm text-white outline outline-sky-500"
                  : ""
              }`}
              onClick={() => handleDateClick(currentDate)}
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

  return (
    <div className="p-8 transition-all duration-300 ease-in-out bg-gray-700 outline outline-sky-500 text-white max-w-lg mx-auto rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          onClick={() =>
            setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)
          }
        >
          &#60;
        </button>
        <div>
          <span className="mx-2">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}
          </span>
          <span>{currentYear}</span>
        </div>
        <button
          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          onClick={() =>
            setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)
          }
        >
          &#62;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        <div className="text-gray-400">Su</div>
        <div className="text-gray-400">Mo</div>
        <div className="text-gray-400">Tu</div>
        <div className="text-gray-400">We</div>
        <div className="text-gray-400">Th</div>
        <div className="text-gray-400">Fr</div>
        <div className="text-gray-400">Sa</div>
      </div>
      <div className="space-y-1">{renderCalendar()}</div>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Selected Range:</h3>
        <p>
          Start Date:{" "}
          {dateRange.startDate
            ? dateRange.startDate.toLocaleDateString()
            : "Not Selected"}
        </p>
        <p>
          End Date:{" "}
          {dateRange.endDate
            ? dateRange.endDate.toLocaleDateString()
            : "Not Selected"}
        </p>
        <p>Weekend Dates:</p>
        <ul>
          {weekendDates.weekendDates.map((date) => (
            <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
      {predefinedRanges && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Predefined Ranges:</h3>
          <div className="flex flex-wrap">
            {predefinedRanges.map((range) => (
              <button
                key={range.label}
                className="px-2 py-1 mr-2 mb-2 rounded bg-gray-700 hover:bg-gray-600"
                onClick={() => handlePredefinedRangeClick(range.range)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
