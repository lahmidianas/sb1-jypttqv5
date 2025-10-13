import React from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { useBookings } from '../../../hooks/useBookings';
import { Loader } from 'lucide-react';
import CalendarDay from './CalendarDay';
import 'react-datepicker/dist/react-datepicker.css';

interface PropertyCalendarProps {
  propertyId: string;
  onDateChange?: (dates: [Date | null, Date | null]) => void;
  minDate?: Date;
}

export default function PropertyCalendar({ 
  propertyId, 
  onDateChange, 
  minDate = new Date() 
}: PropertyCalendarProps) {
  const { bookings, loading } = useBookings(propertyId);
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    if (onDateChange) {
      onDateChange(dates);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <DatePicker
        selected={startDate}
        onChange={(dates: [Date | null, Date | null]) => handleDateChange(dates)}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={minDate}
        locale={fr}
        dateFormat="dd/MM/yyyy"
        monthsShown={2}
        renderDayContents={(dayOfMonth, date) => (
          <CalendarDay
            date={date}
            bookings={bookings}
            isSelected={date.getTime() === startDate?.getTime()}
            isInRange={!!(startDate && endDate && date >= startDate && date <= endDate)}
          />
        )}
        className="w-full"
      />
    </div>
  );
}