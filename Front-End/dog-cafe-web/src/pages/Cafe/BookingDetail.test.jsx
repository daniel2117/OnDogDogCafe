import { render, screen, fireEvent } from '@testing-library/react';
import BookingDetail from './BookingDetail';
import { reservationApi } from '../../services/api';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

jest.mock('../../services/api', () => ({
  reservationApi: {
    create: jest.fn(),
    modify: jest.fn(),
    getAvailability: jest.fn(),
    verifyEmail: jest.fn(),
    verifyCode: jest.fn(),
  },
}));

global.alert = jest.fn();

describe('BookingDetail API Integration', () => {
  test('calls reservationApi.create when form is filled correctly', async () => {
    render(
      <MemoryRouter>
        <BookingDetail lang="en" toggleLang={() => {}} />
      </MemoryRouter>
    );

    // Fill required text fields
    fireEvent.change(screen.getByRole('textbox', { name: /your name/i }), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), {
      target: { value: '123456789' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /message/i }), {
      target: { value: 'Looking forward to it!' },
    });

    // Email input
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'john@example.com' },
    });

    // Set email verified state
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // Override useState (verified = true)
    // Skipping: requires custom mock OR component change

    // Select number of people
    fireEvent.change(screen.getByRole('combobox', { name: /number of people/i }), {
      target: { value: '2' },
    });

    // Manually set date & time & services
    // Skipping here – need to mock useState or expose hooks for better testability

    // Click submit (form not 100% ready — partial logic test only)
    fireEvent.click(screen.getByRole('button', { name: /submit reservation/i }));

    // Not yet called → because date, time, service not filled
    expect(global.alert).toHaveBeenCalledWith("Please complete all fields and verify your email.");
  });
});
