"use client";

import { Deal } from "@/lib/scrapers/types";

interface DealTableProps {
  deals: Deal[];
  isPro: boolean;
  onExportCSV: () => void;
}

export default function DealTable({
  deals,
  isPro,
  onExportCSV,
}: DealTableProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No clearance deals found in this area.</p>
        <p className="text-sm mt-2">
          Try a different ZIP code or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Found <span className="font-bold text-black">{deals.length}</span>{" "}
          clearance deals
        </p>
        {isPro ? (
          <button
            onClick={onExportCSV}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
        ) : (
          <span className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg">
            CSV Export (Pro)
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal, i) => (
              <tr
                key={`${deal.storeNumber}-${deal.productName}-${i}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {deal.storeName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {deal.retailer === "home_depot" ? "Home Depot" : "Lowes"}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {deal.distanceMiles} mi
                </td>
                <td className="px-4 py-3">
                  <a
                    href={deal.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline line-clamp-2"
                  >
                    {deal.productName}
                  </a>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right line-through">
                  ${deal.originalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                  ${deal.salePrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                      deal.discountPct >= 50
                        ? "bg-red-100 text-red-800"
                        : deal.discountPct >= 25
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {deal.discountPct.toFixed(0)}% OFF
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
