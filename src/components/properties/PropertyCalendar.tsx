import React from 'react';
import DatePicker from 'react-datepicker';
import { addDays, isBefore, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBookings } from '../../hooks/useBookings';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
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
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    if (onDateChange) {
      onDateChange(dates);
    }
  };

  const isDateBlocked = (date: Date): boolean => {
    return bookings.some(booking => {
      if (booking.status !== 'confirmed') return false;
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      return isWithinInterval(date, { start, end });
    });
  };

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }: any) => (
    <div className="flex items-center justify-between px-2 py-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      <h2 className="text-lg font-semibold font-display">
        {date.toLocaleString('fr', { month: 'long', year: 'numeric' })}
      </h2>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );

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
        monthsShown={1}
        renderCustomHeader={renderCustomHeader}
        excludeDates={bookings
          .filter(b => b.status === 'confirmed')
          .flatMap(b => {
            const dates = [];
            let currentDate = new Date(b.check_in);
            const endDate = new Date(b.check_out);
            while (isBefore(currentDate, endDate)) {
              dates.push(new Date(currentDate));
              currentDate = addDays(currentDate, 1);
            }
            return dates;
          })}
        dayClassName={date => 
          isDateBlocked(date) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : undefined
        }
        className="w-full"
      />
    </div>
  );
}