import React from 'react';
import { isWithinInterval } from 'date-fns';
import { Booking } from '../../../types/booking';

interface CalendarDayProps {
  date: Date;
  bookings: Booking[];
  isSelected?: boolean;
  isInRange?: boolean;
}

export default function CalendarDay({ date, bookings, isSelected, isInRange }: CalendarDayProps) {
  const isBlocked = bookings.some(booking => {
    if (booking.status !== 'confirmed') return false;
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    return isWithinInterval(date, { start, end });
  });

  const baseClasses = "w-full h-full rounded-full flex items-center justify-center";
  const blockedClasses = "bg-gray-200 text-gray-400 cursor-not-allowed";
  const selectedClasses = "bg-primary text-white";
  const inRangeClasses = "bg-primary/10 text-primary";
  const defaultClasses = "hover:bg-gray-100";

  const classes = [
    baseClasses,
    isBlocked ? blockedClasses : '',
    isSelected ? selectedClasses : '',
    !isBlocked && !isSelected && isInRange ? inRangeClasses : '',
    !isBlocked && !isSelected && !isInRange ? defaultClasses : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {date.getDate()}
    </div>
  );
}