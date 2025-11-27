"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, User, Calendar, Flag, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Driver {
  id: string;
  name: string;
  birthDate: string;
  startDate: string;
}

export default function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      const res = await fetch(`/api/drivers/${id}`);
      if (res.ok) {
        const driver: Driver = await res.json();
        setFormData({
          name: driver.name,
          birthDate: format(new Date(driver.birthDate), "yyyy-MM-dd"),
          startDate: format(new Date(driver.startDate), "yyyy-MM-dd"),
        });
      } else {
        router.push("/drivers");
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
      router.push("/drivers");
    } finally {
      setLoading(false);
    }
  };

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
    
    setSaving(true);
    try {
      const res = await fetch(`/api/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push(`/drivers/${id}`);
      } else {
        const error = await res.json();
        setErrors({ submit: error.message || "Failed to update driver" });
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      setErrors({ submit: "Failed to update driver. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.push("/drivers");
      } else {
        setErrors({ submit: "Failed to delete driver" });
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      setErrors({ submit: "Failed to delete driver. Please try again." });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <Link
          href={`/drivers/${id}`}
          className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-4 tap-target"
        >
          <ArrowLeft size={20} />
          <span>Back to Driver</span>
        </Link>
        
        <h1 className="text-2xl font-bold text-chrome">Edit Driver</h1>
        <p className="text-chrome/60 text-sm mt-1">
          Update driver profile information
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

        {/* Submit Error */}
        {errors.submit && (
          <div className="card p-4 bg-signal-red/10 border-signal-red/30">
            <p className="text-signal-red text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving ? (
            <>
              <div className="spinner w-5 h-5" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="px-4 mt-8">
        <div className="card p-4 border-signal-red/30">
          <h3 className="text-signal-red font-medium mb-2">Danger Zone</h3>
          <p className="text-chrome/60 text-sm mb-4">
            Permanently delete this driver and all their training progress. This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger w-full"
            >
              <Trash2 size={18} />
              Delete Driver
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-signal-red text-sm font-medium">
                Are you sure? This will delete all training progress!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-ghost flex-1"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-danger flex-1"
                >
                  {deleting ? (
                    <>
                      <div className="spinner w-5 h-5" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </main>
  );
}

