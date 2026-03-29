"use client";

import { useState } from "react";

interface ZipInputProps {
  onScan: (zip: string) => void;
  loading: boolean;
}

export default function ZipInput({ onScan, loading }: ZipInputProps) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = zip.trim();

    if (!/^\d{5}$/.test(trimmed)) {
      setError("Please enter a valid 5-digit US ZIP code.");
      return;
    }

    setError("");
    onScan(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
            setError("");
          }}
          placeholder="Enter ZIP code"
          className="px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center tracking-widest w-48 text-black"
          maxLength={5}
          inputMode="numeric"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || zip.length !== 5}
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Scanning...
            </span>
          ) : (
            "Scan Deals"
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-gray-500 text-sm">
        Finds Home Depot & Lowes clearance within 50 miles
      </p>
    </form>
  );
}
