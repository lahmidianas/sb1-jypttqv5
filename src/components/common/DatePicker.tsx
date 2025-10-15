import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';

interface DatePickerProps {
  id?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
  className?: string;
}

export default function DatePicker({
  id,
  selected,
  onChange,
  minDate,
  placeholderText,
  className
}: DatePickerProps) {
  return (
    <ReactDatePicker
      id={id}
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
