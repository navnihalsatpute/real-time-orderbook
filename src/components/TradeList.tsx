"use client";
import React, { useEffect, useRef, useState } from "react";
import { useBinanceSocket } from "../hooks/useBinanceSocket";

export default function TradeList() {
    const { trades } = useBinanceSocket("BTCUSDT");
    const [flashIdx, setFlashIdx] = useState<number | null>(null);
    const previousTopTradeRef = useRef<string | null>(null);

    // When the price or trade changes at the top, flash that item
    useEffect(() => {
        if (!trades.length) return;
        const topTradeId = `${trades[0].price}-${trades[0].time}`;
        if (previousTopTradeRef.current !== topTradeId) {
            previousTopTradeRef.current = topTradeId;
            setFlashIdx(0);
            // Remove flash after a moment
            setTimeout(() => setFlashIdx(null), 400); // 400ms flash
        }
    }, [trades]);

    return (
        <div className="bg-zinc-900 rounded-xl shadow w-full max-w-2xl p-6 mt-3 mb-6 overflow-x-auto">
            <h2>Recent Trades (BTCUSDT)</h2>
            <table className="min-w-[500px] w-full text-xs">
                <thead>
                    <tr>
                        <th className="px-2 py-1">Price</th>
                        <th className="px-2 py-1">Amount</th>
                        <th className="px-2 py-1">Type</th>
                        <th className="px-2 py-1">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.slice(0, 50).map((trade, idx) => (
                        <tr
                            key={`${trade.price}-${trade.time}-${idx}`}
                            className={
                                `even:bg-zinc-800 hover:bg-zinc-800` +
                                (flashIdx === idx ? (trade.isBuyerMaker ? " flash-sell" : " flash-buy") : "")
                            }
                        >
                            <td className={trade.isBuyerMaker ? "text-red-400 font-mono" : "text-green-400 font-mono"}>
                                {trade.price}
                            </td>
                            <td className="font-mono">{trade.amount}</td>
                            <td className={trade.isBuyerMaker ? "text-red-400" : "text-green-400"}>
                                {trade.isBuyerMaker ? "Sell" : "Buy"}
                            </td>
                            <td>
                                <span suppressHydrationWarning>
                                    {new Date(trade.time).toLocaleTimeString()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
