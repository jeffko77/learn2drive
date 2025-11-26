"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, User, Calendar, Flag } from "lucide-react";
import Link from "next/link";

export default function NewDriverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
    } else {
      const birth = new Date(formData.birthDate);
      const now = new Date();
      const age = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 14 || age > 20) {
        newErrors.birthDate = "Driver should be between 14-20 years old";
      }
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const driver = await res.json();
        router.push(`/drivers/${driver.id}`);
      } else {
        const error = await res.json();
        setErrors({ submit: error.message || "Failed to create driver" });
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      setErrors({ submit: "Failed to create driver. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <Link
          href="/drivers"
          className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-4 tap-target"
        >
          <ArrowLeft size={20} />
          <span>Back to Drivers</span>
        </Link>
        
        <h1 className="text-2xl font-bold text-chrome">Add New Driver</h1>
        <p className="text-chrome/60 text-sm mt-1">
          Create a new driver profile with the full training checklist
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-chrome mb-2">
            <User size={16} className="inline mr-2" />
            Driver Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter driver's name"
            className={`input ${errors.name ? "border-signal-red" : ""}`}
          />
          {errors.name && (
            <p className="text-signal-red text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Birth Date Field */}
        <div>
          <label className="block text-sm font-medium text-chrome mb-2">
            <Calendar size={16} className="inline mr-2" />
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className={`input ${errors.birthDate ? "border-signal-red" : ""}`}
          />
          {errors.birthDate && (
            <p className="text-signal-red text-sm mt-1">{errors.birthDate}</p>
          )}
          <p className="text-chrome/50 text-xs mt-1">
            Used to calculate countdown to 16th birthday
          </p>
        </div>

        {/* Start Date Field */}
        <div>
          <label className="block text-sm font-medium text-chrome mb-2">
            <Flag size={16} className="inline mr-2" />
            Training Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={`input ${errors.startDate ? "border-signal-red" : ""}`}
          />
          {errors.startDate && (
            <p className="text-signal-red text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* Info Card */}
        <div className="card p-4 bg-sky-blue/10 border-sky-blue/30">
          <h4 className="font-medium text-sky-blue mb-2">What&apos;s included:</h4>
          <ul className="text-sm text-chrome/80 space-y-1">
            <li>• 8 comprehensive training phases</li>
            <li>• 100+ individual driving skills to master</li>
            <li>• Progress tracking with notes & feedback</li>
            <li>• Birthday countdown to driving eligibility</li>
          </ul>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="card p-4 bg-signal-red/10 border-signal-red/30">
            <p className="text-signal-red text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <>
              <div className="spinner w-5 h-5" />
              Creating...
            </>
          ) : (
            "Create Driver Profile"
          )}
        </button>
      </form>

      <Navigation />
    </main>
  );
}

