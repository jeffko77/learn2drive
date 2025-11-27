"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DriverCard } from "@/components/DriverCard";
import { Plus, Search, Users } from "lucide-react";
import Link from "next/link";

interface Driver {
  id: string;
  name: string;
  birthDate: string;
  startDate: string;
  phases: Array<{
    tasks: Array<{
      progress: { status: string } | null;
    }>;
  }>;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    try {
      await fetch(`/api/drivers/${id}`, { method: "DELETE" });
      setDrivers(drivers.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-chrome">Drivers</h1>
            <p className="text-chrome/60 text-sm">
              Manage driver profiles and training
            </p>
          </div>
          <Link
            href="/drivers/new"
            className="btn btn-primary"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Driver</span>
          </Link>
        </div>

        {/* Search */}
        {drivers.length > 0 && (
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-chrome/40"
            />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11"
            />
          </div>
        )}
      </div>

      {/* Drivers List */}
      <div className="px-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner" />
          </div>
        ) : filteredDrivers.length > 0 ? (
          <div className="space-y-3">
            {filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                id={driver.id}
                name={driver.name}
                birthDate={driver.birthDate}
                startDate={driver.startDate}
                phases={driver.phases}
                onDelete={handleDeleteDriver}
              />
            ))}
          </div>
        ) : drivers.length > 0 ? (
          <div className="card p-8 text-center">
            <Search className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <p className="text-chrome/60">No drivers found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Users className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chrome mb-2">
              No Drivers Yet
            </h3>
            <p className="text-chrome/60 mb-4">
              Add your first driver to start tracking their training progress
            </p>
            <Link href="/drivers/new" className="btn btn-primary inline-flex">
              <Plus size={20} />
              Add First Driver
            </Link>
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}

