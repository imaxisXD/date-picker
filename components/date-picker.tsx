"use client";
import { useState } from "react";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface WeekendDates {
  weekendDates: Date[];
}

interface DateRangePickerProps {
  predefinedRanges?: { label: string; range: DateRange }[];
}

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

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
  const isDateInRange = (date: Date) => {
    const { startDate, endDate } = dateRange;
    return startDate && endDate && date >= startDate && date <= endDate;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekendDates = (start: Date, end: Date) => {
    const tempWeekendDates: Date[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      if (isWeekend(currentDate)) {
        tempWeekendDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return tempWeekendDates;
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
            <div key={`empty-${col}`} className="text-gray-400 p-2"></div>
          );
        } else if (date > daysInMonth) {
          calendarCells.push(
            <div key={`empty-${col}`} className="text-gray-400 p-2"></div>
          );
        } else {
          const currentDate = new Date(currentYear, currentMonth, date);
          const isWeekendDay = isWeekend(currentDate);
          const isSelectedDay = isDateInRange(currentDate);
          const isStartOrEndDate =
            currentDate.getTime() === dateRange.startDate?.getTime() ||
            currentDate.getTime() === dateRange.endDate?.getTime();

          calendarCells.push(
            <div
              key={date}
              className={`p-2 cursor-pointer ${
                isWeekendDay ? "text-gray-400" : "text-gray-800"
              } ${isSelectedDay ? "bg-blue-200" : ""} ${
                isStartOrEndDate ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleDateClick(currentDate)}
            >
              {date}
            </div>
          );
          date++;
        }
      }
      calendarRows.push(
        <div key={row} className="flex">
          {calendarCells}
        </div>
      );
    }
    return calendarRows;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() =>
            setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)
          }
        >
          &lt; Previous
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
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() =>
            setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)
          }
        >
          Next &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        <div className="text-center text-gray-600">Sun</div>
        <div className="text-center text-gray-600">Mon</div>
        <div className="text-center text-gray-600">Tue</div>
        <div className="text-center text-gray-600">Wed</div>
        <div className="text-center text-gray-600">Thu</div>
        <div className="text-center text-gray-600">Fri</div>
        <div className="text-center text-gray-600">Sat</div>
      </div>
      <div>{renderCalendar()}</div>
      <div>
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
                className="px-2 py-1 mr-2 mb-2 rounded bg-gray-200 hover:bg-gray-300"
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
