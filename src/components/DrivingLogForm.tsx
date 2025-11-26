"use client";

import { useState } from "react";
import { Car, Clock, Cloud, MapPin, FileText, X } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ExistingLog {
  id: string;
  date: string;
  duration: number;
  notes: string | null;
  weather: string | null;
  roadTypes: string | null;
}

interface DrivingLogFormProps {
  driverId: string;
  initialDate?: Date;
  existingLog?: ExistingLog;
  onSubmit: (data: {
    date: string;
    duration: number;
    notes: string;
    weather: string;
    roadTypes: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const weatherOptions = [
  { value: "clear", label: "Clear" },
  { value: "cloudy", label: "Cloudy" },
  { value: "rain", label: "Rain" },
  { value: "snow", label: "Snow" },
  { value: "fog", label: "Fog" },
  { value: "night", label: "Night" },
];

const roadTypeOptions = [
  { value: "residential", label: "Residential" },
  { value: "city", label: "City Streets" },
  { value: "highway", label: "Highway" },
  { value: "parking", label: "Parking Lot" },
  { value: "rural", label: "Rural Roads" },
];

export function DrivingLogForm({ driverId, initialDate, existingLog, onSubmit, onCancel }: DrivingLogFormProps) {
  // Parse existing log values
  const existingDuration = existingLog?.duration || 0;
  const existingHours = Math.floor(existingDuration / 60);
  const existingMinutes = existingDuration % 60;
  const existingRoadTypes = existingLog?.roadTypes?.split(", ").filter(Boolean) || [];

  const [date, setDate] = useState(
    existingLog ? format(parseISO(existingLog.date), "yyyy-MM-dd") : format(initialDate || new Date(), "yyyy-MM-dd")
  );
  const [hours, setHours] = useState(existingLog ? existingHours : 0);
  const [minutes, setMinutes] = useState(existingLog ? existingMinutes : 30);
  const [weather, setWeather] = useState(existingLog?.weather || "");
  const [roadTypes, setRoadTypes] = useState<string[]>(existingRoadTypes);
  const [notes, setNotes] = useState(existingLog?.notes || "");
  const [saving, setSaving] = useState(false);

  const isEditing = !!existingLog;

  const handleRoadTypeToggle = (type: string) => {
    setRoadTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes === 0) {
      alert("Please enter a duration");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        date,
        duration: totalMinutes,
        notes,
        weather,
        roadTypes: roadTypes.join(", "),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-chrome flex items-center gap-2">
          <Car size={18} className="text-sky-blue" />
          {isEditing ? "Edit Driving Session" : "Log Driving Session"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-chrome/10 text-chrome/60 hover:text-chrome"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-chrome/80 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-chrome/80 mb-2 flex items-center gap-2">
            <Clock size={14} />
            Duration
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="input text-center"
                />
                <span className="text-chrome/60 text-sm">hours</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="input text-center"
                />
                <span className="text-chrome/60 text-sm">mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div>
          <label className="block text-sm font-medium text-chrome/80 mb-2 flex items-center gap-2">
            <Cloud size={14} />
            Weather Conditions
          </label>
          <div className="flex flex-wrap gap-2">
            {weatherOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWeather(weather === option.value ? "" : option.value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  weather === option.value
                    ? "bg-sky-blue text-white"
                    : "bg-chrome/10 text-chrome/70 hover:bg-chrome/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Road Types */}
        <div>
          <label className="block text-sm font-medium text-chrome/80 mb-2 flex items-center gap-2">
            <MapPin size={14} />
            Road Types
          </label>
          <div className="flex flex-wrap gap-2">
            {roadTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRoadTypeToggle(option.value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  roadTypes.includes(option.value)
                    ? "bg-signal-green text-white"
                    : "bg-chrome/10 text-chrome/70 hover:bg-chrome/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-chrome/80 mb-2 flex items-center gap-2">
            <FileText size={14} />
            Session Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you practice? Any challenges or achievements?"
            className="input min-h-[100px] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving ? "Saving..." : isEditing ? "Update Session" : "Save Driving Log"}
        </button>
      </div>
    </form>
  );
}

