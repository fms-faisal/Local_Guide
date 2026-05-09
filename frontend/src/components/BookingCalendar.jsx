import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingCalendar = ({ availableDates = [], onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Only allow selection of available dates
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const iso = date.toISOString().split('T')[0];
      return !availableDates.includes(iso);
    }
    return false;
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={handleChange}
        tileDisabled={tileDisabled}
      />
      {selectedDate && (
        <div className="mt-2">Selected: {selectedDate.toLocaleDateString()}</div>
      )}
    </div>
  );
};

export default BookingCalendar;
