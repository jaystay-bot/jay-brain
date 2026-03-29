"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ZipInput from "@/components/ZipInput";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleScan(zip: string) {
    setLoading(true);
    router.push(`/deals?zip=${zip}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Find Clearance Deals Near You
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Scan Home Depot & Lowes stores within 50 miles for the best
          clearance prices. See every markdown with store name, distance, and
          discount percentage.
        </p>

        {!isLoaded ? (
          <div className="animate-pulse h-12 w-64 mx-auto bg-gray-200 rounded-lg" />
        ) : isSignedIn ? (
          <ZipInput onScan={handleScan} loading={loading} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <SignInButton mode="modal">
              <button className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In to Start Scanning
              </button>
            </SignInButton>
            <p className="text-sm text-gray-500">
              Free: 3 scans/day | Pro: Unlimited + CSV + Telegram alerts
            </p>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Enter ZIP Code
            </h3>
            <p className="text-sm text-gray-600">
              Type any US ZIP code to find Home Depot and Lowes stores within 50
              miles.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              See Every Deal
            </h3>
            <p className="text-sm text-gray-600">
              View clearance items sorted by discount percentage — biggest
              savings first.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Pro: CSV + Alerts
            </h3>
            <p className="text-sm text-gray-600">
              Export deals to CSV and get Telegram alerts when new clearance
              items appear. $15/mo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
