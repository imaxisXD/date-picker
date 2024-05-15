export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface WeekendDates {
  weekendDates: Date[];
}

export interface DateRangePickerProps {
  predefinedRanges?: {
    label: string;
    range: DateRange;
  }[];
  closeDatePicker: () => void;
}
