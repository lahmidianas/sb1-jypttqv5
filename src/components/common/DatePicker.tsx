import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  className?: string;
}

export default function DatePicker({
  selected,
  onChange,
  minDate,
  placeholderText,
  className
}: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      placeholderText={placeholderText}
      className={className}
      dateFormat="dd/MM/yyyy"
      locale={fr}
      isClearable
    />
  );
}