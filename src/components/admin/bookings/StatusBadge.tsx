import React from 'react';
import { BookingStatus } from '../../../types/booking';

const statusConfig = {
  waiting: {
    label: 'Waiting',
    className: 'bg-yellow-100 text-yellow-800'
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-800'
  }
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}