"use client";

import { useState, useEffect } from "react";
import { differenceInDays, differenceInMonths, differenceInYears, addYears, format } from "date-fns";
import { Cake, PartyPopper, Car } from "lucide-react";

interface BirthdayCountdownProps {
  birthDate: Date | string;
  name: string;
}

export function BirthdayCountdown({ birthDate, name }: BirthdayCountdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-road-dark/50 rounded-lg"></div>
      </div>
    );
  }

  const birth = new Date(birthDate);
  const now = new Date();
  const sixteenthBirthday = addYears(birth, 16);
  
  const isPast16 = now >= sixteenthBirthday;
  const daysUntil = differenceInDays(sixteenthBirthday, now);
  const monthsUntil = differenceInMonths(sixteenthBirthday, now);
  const currentAge = differenceInYears(now, birth);

  if (isPast16) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-signal-green/20">
            <Car className="w-8 h-8 text-signal-green" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-chrome">{name}</h3>
            <p className="text-chrome/60 text-sm">Ready for the Road!</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 py-4 px-6 bg-signal-green/10 rounded-xl border border-signal-green/30">
          <PartyPopper className="w-6 h-6 text-signal-green" />
          <span className="text-signal-green font-semibold">
            {name} is {currentAge} years old!
          </span>
        </div>
      </div>
    );
  }

  const years = Math.floor(monthsUntil / 12);
  const months = monthsUntil % 12;
  const days = daysUntil - (monthsUntil * 30);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-highway-orange/20">
          <Cake className="w-8 h-8 text-highway-orange" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-chrome">16th Birthday Countdown</h3>
          <p className="text-chrome/60 text-sm">
            {format(sixteenthBirthday, "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="countdown">
        {years > 0 && (
          <div className="countdown-item">
            <span className="countdown-value">{years}</span>
            <span className="countdown-label">{years === 1 ? "Year" : "Years"}</span>
          </div>
        )}
        <div className="countdown-item">
          <span className="countdown-value">{months}</span>
          <span className="countdown-label">{months === 1 ? "Month" : "Months"}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{Math.abs(days)}</span>
          <span className="countdown-label">{Math.abs(days) === 1 ? "Day" : "Days"}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-chrome/60 text-sm">
        {currentAge} years old • {daysUntil} days to go!
      </div>
    </div>
  );
}

