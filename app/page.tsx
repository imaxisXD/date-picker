"use client";
import DatePicker from "@/components/date-picker";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startdate");
  const endDate = searchParams.get("enddate");
  const today = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const predefinedRanges = [
    {
      label: "Last 7 Days",
      range: {
        endDate: new Date(today),
        startDate: new Date(today.setDate(today.getDate() - 7)),
      },
    },
    {
      label: "Last 30 Days",
      range: {
        endDate: new Date(today),
        startDate: new Date(today.setDate(today.getDate() - 30)),
      },
    },
    // Add more predefined ranges as needed
  ];
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
          readOnly
          placeholder="Click to show date picker"
          className="bg-transparent outline-none cursor-pointer w-full"
          value={startDate && endDate ? `${startDate} - ${endDate}` : ""}
        />
        <CalendarDays strokeWidth={1.5} height={18} width={18} />
      </button>
      {showDatePicker && (
        <DatePicker
          closeDatePicker={handleClick}
          predefinedRanges={predefinedRanges}
        />
      )}
      <span className="mt-4">
        Made with ❤️ by{" "}
        <Link
          href="https://twitter.com/abhishek"
          target="_blank"
          rel="noreferrer"
          className="text-sky-500 underline"
        >
          @abhishek
        </Link>
        <span className="mx-2">|</span>
        <Link
          href="mailto:sunny735084@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="text-sky-500 underline"
        >
          sunny735084@gmail.com
        </Link>
      </span>
    </main>
  );
}
