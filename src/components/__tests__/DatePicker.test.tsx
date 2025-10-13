import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../common/DatePicker';

describe('DatePicker', () => {
  const mockProps = {
    selected: null,
    onChange: vi.fn(),
    minDate: new Date(),
    placeholderText: 'Select date',
    className: 'test-class'
  };

  it('renders with placeholder text', () => {
    render(<DatePicker {...mockProps} />);
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DatePicker {...mockProps} />);
    expect(screen.getByPlaceholderText('Select date')).toHaveClass('test-class');
  });

  it('calls onChange when date is selected', async () => {
    render(<DatePicker {...mockProps} />);
    const input = screen.getByPlaceholderText('Select date');
    
    await act(async () => {
      await userEvent.type(input, '2024-03-01');
    });
    
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('displays selected date when provided', () => {
    const date = new Date('2024-03-01');
    render(<DatePicker {...mockProps} selected={date} />);
    
    const input = screen.getByDisplayValue('01/03/2024');
    expect(input).toBeInTheDocument();
  });
});