import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import BookingForm from '../properties/BookingForm';
import { CREATE_BOOKING } from '../../graphql/mutations/bookings';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  } as any;
});

// Mock DatePicker to a simple input that fires onChange with Date
vi.mock('../common/DatePicker', () => ({
  default: (props: any) => (
    <input
      id={props.id}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        props.onChange(e.target.value ? new Date(e.target.value) : null)
      }
    />
  ),
}));

// Mock useAuthContext to unauthenticated user
vi.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => ({ user: null })
}));

// GraphQL mocks
const mocks = [
  {
    request: {
      query: CREATE_BOOKING,
      variables: {
        input: {
          propertyId: '123',
          checkIn: '2024-03-01',
          checkOut: '2024-03-03',
        },
      },
    },
    result: {
      data: {
        createBooking: {
          id: '456',
          checkIn: '2024-03-01',
          checkOut: '2024-03-03',
          status: 'waiting',
          totalPrice: 200,
          property: {
            id: '123',
            title: 'Test Property',
          },
        },
      },
    },
  },
];

describe('BookingForm', () => {
  const mockProps = {
    propertyId: '123',
    price: 100,
  };

  const renderBookingForm = () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <BookingForm {...mockProps} />
        </BrowserRouter>
      </MockedProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders date inputs', () => {
    renderBookingForm();
    expect(screen.getByLabelText(/date d'arrivée/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date de départ/i)).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated user tries to book', async () => {
    renderBookingForm();

    const checkInInput = screen.getByLabelText(/date d'arrivée/i);
    const checkOutInput = screen.getByLabelText(/date de départ/i);
    await userEvent.type(checkInInput, '2024-03-01');
    await userEvent.type(checkOutInput, '2024-03-03');

    const bookButton = screen.getByRole('button', { name: /réserver/i });
    await userEvent.click(bookButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('disables submit button when dates are not selected', () => {
    renderBookingForm();
    const bookButton = screen.getByRole('button', { name: /réserver/i });
    expect(bookButton).toBeDisabled();
  });

  it('calculates total price when dates are selected', async () => {
    renderBookingForm();

    const checkInInput = screen.getByLabelText(/date d'arrivée/i);
    const checkOutInput = screen.getByLabelText(/date de départ/i);
    await userEvent.type(checkInInput, '2024-03-01');
    await userEvent.type(checkOutInput, '2024-03-03');

    await waitFor(() => {
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });
  });
});
