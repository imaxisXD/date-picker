"use client";
import { useState } from "react";
import { DateRange, DateRangePickerProps, WeekendDates } from "@/utils/types";
import { getWeekendDates, isWeekend, months, years } from "@/utils/utils";
import { toast } from "sonner";
import useDropdown from "@/utils/hooks/useDropDown";
import { WeekHeader } from "./week-header";
import Calendar from "./calendar";
import { useRouter } from "next/navigation";

const DatePicker: React.FC<DateRangePickerProps> = ({
  predefinedRanges,
  closeDatePicker,
}) => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [weekendDates, setWeekendDates] = useState<WeekendDates>({
    weekendDates: [],
  });

  // Initialize months and years based on today's date
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Initialize Calendar 2 to the next month
  const [nextMonth, setNextMonth] = useState(
    today.getMonth() === 11 ? 0 : today.getMonth() + 1
  );
  const [nextMonthYear, setNextMonthYear] = useState(
    today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear()
  );

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

  const handleDateClick = (date: Date) => {
    if (!isWeekend(date)) {
      if (!dateRange.startDate) {
        setDateRange({ startDate: date, endDate: null });
      } else if (!dateRange.endDate) {
        const endDate = date > dateRange.startDate ? date : dateRange.startDate;
        const startDate =
          date < dateRange.startDate ? date : dateRange.startDate;
        setDateRange({ startDate, endDate });
        setWeekendDates({
          weekendDates: getWeekendDates(startDate, endDate),
        });
      } else {
        setDateRange({ startDate: date, endDate: null });
        setWeekendDates({ weekendDates: [] });
      }
    } else {
      toast.warning("Select a date that is not a weekend");
    }
  };
  const handleCurrentMonthChange = (direction: "next" | "prev") => {
    let newCurrentMonth = currentMonth;
    let newCurrentYear = currentYear;

    if (direction === "next") {
      if (currentMonth === 11) {
        newCurrentMonth = 0;
        newCurrentYear = currentYear + 1;
      } else {
        newCurrentMonth = currentMonth + 1;
      }
    } else {
      if (currentMonth === 0) {
        newCurrentMonth = 11;
        newCurrentYear = currentYear - 1;
      } else {
        newCurrentMonth = currentMonth - 1;
      }
    }

    setCurrentMonth(newCurrentMonth);
    setCurrentYear(newCurrentYear);
    updateNextMonthYear(newCurrentMonth, newCurrentYear);
  };

  const handleNextMonthChange = (direction: "next" | "prev") => {
    let newNextMonth = nextMonth;
    let newNextMonthYear = nextMonthYear;

    if (direction === "next") {
      if (nextMonth === 11) {
        newNextMonth = 0;
        newNextMonthYear = nextMonthYear + 1;
      } else {
        newNextMonth = nextMonth + 1;
      }
    } else {
      if (nextMonth === 0) {
        newNextMonth = 11;
        newNextMonthYear = nextMonthYear - 1;
      } else {
        newNextMonth = nextMonth - 1;
      }
    }

    setNextMonth(newNextMonth);
    setNextMonthYear(newNextMonthYear);
    updateCurrentMonthYear(newNextMonth, newNextMonthYear);
  };

  const updateNextMonthYear = (currentMonth: number, currentYear: number) => {
    if (currentMonth === 11) {
      setNextMonth(0);
      setNextMonthYear(currentYear + 1);
    } else {
      setNextMonth(currentMonth + 1);
      setNextMonthYear(currentYear);
    }
  };

  const updateCurrentMonthYear = (nextMonth: number, nextMonthYear: number) => {
    if (nextMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(nextMonthYear - 1);
    } else {
      setCurrentMonth(nextMonth - 1);
      setCurrentYear(nextMonthYear);
    }
  };

  const handleMonthChange = (index: number) => {
    const newNextMonth = index;
    const newNextMonthYear = index === 0 ? nextMonthYear - 1 : nextMonthYear;

    setNextMonth(newNextMonth);
    setNextMonthYear(newNextMonthYear);
    setCurrentMonth(newNextMonth === 11 ? 0 : newNextMonth + 1);
    setCurrentYear(
      newNextMonth === 11 ? newNextMonthYear + 1 : newNextMonthYear
    );
    setShowNextMonthDropdown(false);
  };

  const handleYearChange = (year: number) => {
    const newNextMonthYear = year;

    setNextMonthYear(newNextMonthYear);
    setCurrentYear(newNextMonthYear);
    setShowNextYearDropdown(false);
  };

  return (
    <div className="p-2 transition-all duration-300 ease-in-out bg-gray-700 outline outline-sky-500 text-white max-w-4xl w-[40rem] mx-auto rounded-md shadow-md">
      <div className="flex justify-between w-full gap-2 border rounded-lg relative">
        <div className="flex flex-col items-center gap-3 p-2 h-full w-1/2">
          <div className="flex justify-around items-center gap-5">
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => handleCurrentMonthChange("prev")}
            >
              &#60;
            </button>
            <div className="flex items-center justify-between gap-5 relative">
              <button
                className="cursor-pointer border border-white/25 w-24 py-0.5 rounded-md bg-slate-500/80 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              >
                {months[currentMonth]}
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
              onClick={() => handleCurrentMonthChange("next")}
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
            highlightToday={true}
          />
        </div>

        <div className="flex flex-col items-center gap-3 p-2 h-full w-1/2">
          <div className="flex justify-around items-center gap-5">
            <button
              className="border px-2.5 py-1 border-sky-300 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={() => handleNextMonthChange("prev")}
            >
              &#60;
            </button>
            <div className="flex items-center justify-between gap-5 relative">
              <button
                className="cursor-pointer border border-white/25 w-24 py-0.5 rounded-md bg-slate-500/80 hover:bg-gray-600 transition-all duration-300 ease-in-out"
                onClick={() => setShowNextMonthDropdown(!showNextMonthDropdown)}
              >
                {months[nextMonth]}
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
                        onClick={() => handleMonthChange(index)}
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
                        onClick={() => handleYearChange(year)}
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
              onClick={() => handleNextMonthChange("next")}
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
            highlightToday={true}
          />
        </div>
      </div>

      <div className="flex justify-between items-start border-t border-white/35 mt-4">
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
        {dateRange.startDate && dateRange.endDate && (
          <button
            className="px-4 mt-4 py-1 rounded bg-sky-500 hover:bg-sky-600 transition-all duration-300 ease-in-out"
            onClick={() => {
              closeDatePicker();
              router.push(
                `?startdate=${dateRange.startDate?.toLocaleDateString()}&enddate=${dateRange.endDate?.toLocaleDateString()}`
              );
            }}
          >
            Save
          </button>
        )}

        {predefinedRanges && (
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Predefined Ranges:</h3>
            <div className="flex flex-wrap">
              {predefinedRanges.map((range) => (
                <button
                  key={range.label}
                  className="px-2 py-1 mr-2 mb-2 rounded bg-gray-700 hover:bg-gray-600"
                  //   onClick={() => handlePredefinedRangeClick(range.range)}
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
