"use client";
import { useEffect, useRef, useState } from "react";

type Trade = {
    price: string;
    amount: string;
    time: number;
    isBuyerMaker: boolean;
};

type OrderBook = {
    bids: Map<string, string>;
    asks: Map<string, string>;
};

export function useBinanceSocket(symbol: string) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [orderBook, setOrderBook] = useState<OrderBook>({
        bids: new Map(),
        asks: new Map(),
    });

    const tradesWsRef = useRef<WebSocket | null>(null);
    const depthWsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Trades WebSocket
        const tradesWs = new WebSocket(
            `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`
        );
        tradesWsRef.current = tradesWs;

        tradesWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.e === "aggTrade") {
                setTrades((prev) => [
                    {
                        price: data.p,
                        amount: data.q,
                        time: data.T,
                        isBuyerMaker: data.m,
                    },
                    ...prev,
                ].slice(0, 50)); // keep only most recent 50 trades
            }
        };

        // Order Book Delta WebSocket
        const depthWs = new WebSocket(
            `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
        );
        depthWsRef.current = depthWs;

        depthWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Format: {b: [["price", "amount"], ...], a: [["price", "amount"], ...]}
            setOrderBook((prev) => {
                const bids = new Map(prev.bids);
                const asks = new Map(prev.asks);

                data.b?.forEach(([price, amount]: [string, string]) => {
                    if (parseFloat(amount) === 0) {
                        bids.delete(price);
                    } else {
                        bids.set(price, amount);
                    }
                });
                data.a?.forEach(([price, amount]: [string, string]) => {
                    if (parseFloat(amount) === 0) {
                        asks.delete(price);
                    } else {
                        asks.set(price, amount);
                    }
                });
                return { bids, asks };
            });
        };

        return () => {
            tradesWs.close();
            depthWs.close();
        };
    }, [symbol]);

    return { trades, orderBook };
}
