import React, { useEffect, useState } from "react";
import "./CountdownTimer.scss";

const CountdownTimer = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, [endTime]);

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
