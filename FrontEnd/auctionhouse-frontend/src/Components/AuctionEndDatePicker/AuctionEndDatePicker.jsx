import React, { useState } from "react";
import "./AuctionEndDatePicker.scss";

export default function AuctionEndDatePicker({ setEndTime }) {
  const [error, setError] = useState(null);

  const handleDateChange = (e) => {
    const selectedValue = e.target.value;

    if (!selectedValue) {
      setError("");
      setEndTime(null);
      return;
    }

    const selectedTimeMs = new Date(selectedValue).getTime();
    const now = Date.now();

    const oneMinute = 60 * 1000;

    if (selectedTimeMs < now + oneMinute) {
      setError("End time must be at least 1 minute from now.");
      return;
    }

    setError(null);
    setEndTime(selectedTimeMs);
  };

  return (
    <div className="auction-date-picker-component-wrapper">
      <input
        type="datetime-local"
        className="auction-date-picker-component-input"
        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
        onChange={handleDateChange}
      />

      {error && <p className="auction-date-picker-component-error">{error}</p>}
    </div>
  );
}
