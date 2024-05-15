"use client";
import DatePicker from "@/components/date-picker";
import { DateRange } from "@/utils/types";
import { CalendarDays } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startdate");
  const endDate = searchParams.get("enddate");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleClick = () => {
    setShowDatePicker(!showDatePicker);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={handleClick}
        className="w-60 antialiased flex items-center border justify-evenly p-1 rounded-md bg-white/25 hover:border hover:border-sky-500 transition-all duration-300 ease-in-out"
      >
        <input
          placeholder="Click to show date picker"
          className="bg-transparent outline-none cursor-pointer w-full"
          value={startDate && endDate ? `${startDate} - ${endDate}` : ""}
        />
        <CalendarDays strokeWidth={1.5} height={18} width={18} />
      </button>
      {showDatePicker && <DatePicker closeDatePicker={handleClick} />}
    </main>
  );
}
