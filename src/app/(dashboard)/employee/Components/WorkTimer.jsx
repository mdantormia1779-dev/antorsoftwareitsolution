"use client";

import { useEffect, useState } from "react";

const WorkTimer = ({ checkInTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!checkInTime) {
      setElapsed(0);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(
        checkInTime
      ).getTime();

      const currentTime = Date.now();

      const difference = Math.max(
        0,
        currentTime - startTime
      );

      setElapsed(difference);
    };

    updateTimer();

    const interval = setInterval(
      updateTimer,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [checkInTime]);

  const totalSeconds = Math.floor(
    elapsed / 1000
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return (
    <div className="font-mono font-semibold text-slate-700">
      {String(hours).padStart(2, "0")}:
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
};

export default WorkTimer;