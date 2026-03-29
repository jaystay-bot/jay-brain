"use client";

interface ProBadgeProps {
  isPro: boolean;
  onUpgrade: () => void;
  scansRemaining?: number;
}

export default function ProBadge({
  isPro,
  onUpgrade,
  scansRemaining,
}: ProBadgeProps) {
  if (isPro) {
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
        PRO
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {scansRemaining !== undefined && (
        <span className="text-sm text-gray-500">
          {scansRemaining} free scans left today
        </span>
      )}
      <button
        onClick={onUpgrade}
        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all"
      >
        Upgrade to Pro — $15/mo
      </button>
    </div>
  );
}
