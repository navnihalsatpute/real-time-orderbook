"use client";
import React from "react";
import { useBinanceSocket } from "../hooks/useBinanceSocket";

function getSortedEntries(map: Map<string, string>, isBids: boolean) {
    return Array.from(map.entries())
        .sort(([priceA], [priceB]) =>
            isBids
                ? parseFloat(priceB) - parseFloat(priceA) // Descending for bids
                : parseFloat(priceA) - parseFloat(priceB) // Ascending for asks
        );
}

export default function OrderBook() {
    const { orderBook } = useBinanceSocket("BTCUSDT");

    // Prepare sorted bids and asks
    const sortedBids = getSortedEntries(orderBook.bids, true);
    const sortedAsks = getSortedEntries(orderBook.asks, false);

    // Calculate cumulative totals for each
    let bidsTotal = 0;
    const bidsRows = sortedBids.map(([price, amount]) => {
        bidsTotal += parseFloat(amount);
        return { price, amount, total: bidsTotal };
    });
    let asksTotal = 0;
    const asksRows = sortedAsks.map(([price, amount]) => {
        asksTotal += parseFloat(amount);
        return { price, amount, total: asksTotal };
    });

    // Calculate spread
    const highestBid = bidsRows[0]?.price ? parseFloat(bidsRows[0].price) : null;
    const lowestAsk = asksRows[0]?.price ? parseFloat(asksRows[0].price) : null;
    const spread =
        highestBid !== null && lowestAsk !== null
            ? (lowestAsk - highestBid).toFixed(2)
            : null;

    return (
        <div className="bg-zinc-900 rounded-xl shadow w-full max-w-full p-6 mt-3 mb-6">
            <h2 className="text-lg text-zinc-300 font-semibold mb-4">Order Book</h2>
            <div className="flex flex-col md:flex-row w-full gap-4 justify-center">
                {/* Bids Table - Horizontally scrollable on small devices */}
                <div className="overflow-x-auto w-full md:w-2/5">
                    <h3 className="text-green-700 mb-2">Bids</h3>
                    <table className="min-w-[350px] w-full text-xs">
                        <thead className="sticky top-0 bg-zinc-900">
                            <tr>
                                <th className="px-4 py-2 font-mono">Price</th>
                                <th className="px-4 py-2 font-mono">Amount</th>
                                <th className="px-4 py-2 font-mono">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bidsRows.slice(0, 20).map((row, idx) => (
                                <tr key={row.price} className="even:bg-zinc-800 hover:bg-zinc-800" style={{ position: "relative" }}>
                                    <td colSpan={3} style={{ padding: 0 }}>
                                        <div style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            height: "100%",
                                            width: `${(row.total / (bidsRows[19]?.total || 1)) * 100}%`,
                                            background: "rgba(16, 185, 129, 0.18)",
                                            zIndex: 0,
                                            pointerEvents: "none",
                                        }} />
                                        <div style={{
                                            position: "relative",
                                            zIndex: 1,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0.2em 0.5em",
                                        }}>
                                            <span className="text-green-700 font-mono">{row.price}</span>
                                            <span className="font-mono">{row.amount}</span>
                                            <span className="font-mono">{row.total}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Spread */}
                <div className="flex flex-col items-center justify-center bg-zinc-800 rounded-xl px-3 py-2 shadow my-4 md:my-0">
                    <div className="text-sm text-zinc-300">Spread</div>
                    <div className="text-lg font-bold text-white">
                        {spread !== null ? spread : "--"}
                    </div>
                </div>

                {/* Asks Table - Horizontally scrollable on small devices */}
                <div className="overflow-x-auto w-full md:w-2/5">
                    <h3 className="text-red-700 mb-2">Asks</h3>
                    <table className="min-w-[350px] w-full text-xs">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 font-mono">Price</th>
                                <th className="px-4 py-2 font-mono">Amount</th>
                                <th className="px-4 py-2 font-mono">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asksRows.slice(0, 20).map((row, idx) => (
                                <tr key={row.price} className="even:bg-zinc-800 hover:bg-zinc-800" style={{ position: "relative" }}>
                                    <td colSpan={3} style={{ padding: 0 }}>
                                        <div style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            height: "100%",
                                            width: `${(row.total / (asksRows[19]?.total || 1)) * 100}%`,
                                            background: "rgba(239, 68, 68, 0.18)",
                                            zIndex: 0,
                                            pointerEvents: "none",
                                        }} />
                                        <div style={{
                                            position: "relative",
                                            zIndex: 1,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0.2em 0.5em",
                                        }}>
                                            <span className="text-red-700 font-mono">{row.price}</span>
                                            <span className="font-mono">{row.amount}</span>
                                            <span className="font-mono">{row.total}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}
