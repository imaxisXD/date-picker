"use client";
import { useState } from "react";
import { DateRange, DateRangePickerProps, WeekendDates } from "@/utils/types";
import { getWeekendDates, isWeekend, months, years } from "@/utils/utils";
import { toast } from "sonner";
import useDropdown from "@/utils/hooks/useDropDown";
import { WeekHeader } from "./week-header";
import Calendar from "./calendar";

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
  const {
    ref: monthRef,
    isOpen: showMonthDropdown,
    setIsOpen: setShowMonthDropdown,
  } = useDropdown();
  const {
    ref: yearRef,
    isOpen: showYearDropdown,
    setIsOpen: setShowYearDropdown,
  } = useDropdown();
  const {
    ref: nextMonthRef,
    isOpen: showNextMonthDropdown,
    setIsOpen: setShowNextMonthDropdown,
  } = useDropdown();
  const {
    ref: nextYearRef,
    isOpen: showNextYearDropdown,
    setIsOpen: setShowNextYearDropdown,
  } = useDropdown();

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

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
    } else {
      toast.warning("Select a date that is not a weekend");
    }
  };

  const handlePredefinedRangeClick = (range: DateRange) => {
    const { startDate, endDate } = range;
    setDateRange({ startDate, endDate });
    if (startDate && endDate)
      setWeekendDates({ weekendDates: getWeekendDates(startDate, endDate) });
  };

  return (
    <div className="p-2 transition-all duration-300 ease-in-out bg-gray-700 outline outline-sky-500 text-white max-w-4xl mx-auto rounded-md shadow-md">
      <div className="flex justify-between w-full gap-2 border rounded-lg relative">
        <div className="flex flex-col items-center gap-3 p-2 h-full w-1/2">
          <div className="flex justify-around items-center gap-5 ">
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              &#60;
            </button>
            <div className="flex items-center justify-between gap-5 relative">
              <button
                className="cursor-pointer border border-white/25 px-2 py-0.5 rounded-md bg-slate-500/80 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              >
                <span className="mx-2">{months[currentMonth]}</span>
              </button>
              {showMonthDropdown && (
                <ul
                  ref={monthRef}
                  className="absolute flex flex-col top-[125%] right-12 w-fit overflow-auto h-48 bg-gray-800 p-2 rounded shadow-md z-10"
                >
                  {months.map((month, index) => (
                    <li key={month} className="w-full">
                      <button
                        className="cursor-pointer p-1 hover:bg-gray-600 w-full"
                        onClick={() => {
                          setCurrentMonth(index);
                          setShowMonthDropdown(false);
                        }}
                      >
                        {month}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="cursor-pointer border border-white/25 px-2 py-0.5 rounded-md bg-sky-600/50 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowYearDropdown(!showYearDropdown)}
              >
                <span>{currentYear}</span>
              </button>
              {showYearDropdown && (
                <ul
                  ref={yearRef}
                  className="absolute top-[125%] left-20 bg-gray-800 p-2 rounded shadow-md z-10 h-48 overflow-y-auto"
                >
                  {years.map((year) => (
                    <li key={year} className="w-full">
                      <button
                        className="cursor-pointer p-1 hover:bg-gray-600 w-full"
                        onClick={() => {
                          setCurrentYear(year);
                          setShowYearDropdown(false);
                        }}
                      >
                        {year}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              &#62;
            </button>
          </div>

          <WeekHeader />
          <Calendar
            month={currentMonth}
            year={currentYear}
            dateRange={dateRange}
            weekendDates={weekendDates}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="flex flex-col items-center gap-3 p-2 h-full w-1/2">
          <div className="flex justify-around items-center gap-5">
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => {
                if (nextMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(nextMonth - 1);
                }
              }}
            >
              &#60;
            </button>
            <div className="flex items-center justify-between gap-5 relative">
              <button
                className="cursor-pointer border border-white/25 px-2 py-0.5 rounded-md bg-slate-500/80 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowNextMonthDropdown(!showNextMonthDropdown)}
              >
                <span className="mx-2">{months[nextMonth]}</span>
              </button>
              {showNextMonthDropdown && (
                <ul
                  ref={nextMonthRef}
                  className="absolute flex flex-col top-[125%] right-12 w-fit overflow-auto h-48 bg-gray-800 p-2 rounded shadow-md z-10"
                >
                  {months.map((month, index) => (
                    <li key={month} className="w-full">
                      <button
                        className="cursor-pointer p-1 hover:bg-gray-600 w-full"
                        onClick={() => {
                          setCurrentMonth(index - 1);
                          setShowNextMonthDropdown(false);
                        }}
                      >
                        {month}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="cursor-pointer border border-white/25 px-2 py-0.5 rounded-md bg-sky-600/50 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowNextYearDropdown(!showNextYearDropdown)}
              >
                <span>{nextMonthYear}</span>
              </button>
              {showNextYearDropdown && (
                <ul
                  ref={nextYearRef}
                  className="absolute top-[125%] left-20 bg-gray-800 p-2 rounded shadow-md z-10 h-48 overflow-y-auto"
                >
                  {years.map((year) => (
                    <li key={year} className="w-full">
                      <button
                        className="cursor-pointer p-1 hover:bg-gray-600 w-full"
                        onClick={() => {
                          setCurrentYear(year);
                          setShowNextYearDropdown(false);
                        }}
                      >
                        {year}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => {
                if (nextMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(nextMonth + 1);
                }
              }}
            >
              &#62;
            </button>
          </div>
          <WeekHeader />
          <Calendar
            month={nextMonth}
            year={nextMonthYear}
            dateRange={dateRange}
            weekendDates={weekendDates}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      <div className="flex justify-between items(start (border-t border-white/35 mt-4">
        <div className="mt-4 w-fit">
          <h3 className="text-base mb-2">Weekend Dates:</h3>
          <ul className="overflow-auto h-32">
            {weekendDates.weekendDates.map((date) => (
              <li key={date.toISOString()}>{date.toLocaleDateString()}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 w-fit flex items-center justify-center gap-3">
          <h3 className="text-base">Start Dates:</h3>
          <span className="text-gray-400">
            {dateRange.startDate?.toLocaleDateString()}
          </span>
          <h3 className="text-base">End Dates:</h3>
          <span className="text-gray-400">
            {dateRange.endDate?.toLocaleDateString()}
          </span>
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
    </div>
  );
};

export default DatePicker;
