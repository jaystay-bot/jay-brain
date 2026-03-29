"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ZipInput from "@/components/ZipInput";
import DealTable from "@/components/DealTable";
import ProBadge from "@/components/ProBadge";
import { ScanResult } from "@/lib/scrapers/types";

export default function DealsPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const initialZip = searchParams.get("zip") || "";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [scansRemaining, setScansRemaining] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (initialZip) {
      runScan(initialZip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runScan(zip: string) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed.");
        if (data.upgradeRequired) {
          setScansRemaining(0);
        }
        return;
      }

      setResult(data);
      if (data.isPro) setIsPro(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    if (!result?.deals.length) return;

    try {
      const res = await fetch("/api/deals/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: result.deals,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Export failed.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clearance-deals-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
  }

  async function handleUpgrade() {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Could not start checkout. Please try again.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-6 mb-8">
        <ZipInput onScan={runScan} loading={loading} />
        <ProBadge
          isPro={isPro}
          onUpgrade={handleUpgrade}
          scansRemaining={scansRemaining}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      {result && (
        <>
          {result.errors.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              <strong>Partial results:</strong> Some stores could not be
              scanned. {result.errors.length} error(s) occurred.
            </div>
          )}

          <div className="mb-4 text-sm text-gray-500 text-center">
            Scanned {result.storesScanned} stores near {result.zip} (
            {result.radiusMiles}mi) at{" "}
            {new Date(result.scannedAt).toLocaleString()}
          </div>

          <DealTable
            deals={result.deals}
            isPro={isPro}
            onExportCSV={handleExportCSV}
          />
        </>
      )}
    </div>
  );
}
