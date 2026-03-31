'use client';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { cn } from "@/lib/utils";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type OHLC = [number, number, number, number, number];

interface CandlestickChartProps {
    coinId: string;
    poolId?: string;
    initialData: OHLC[];
    initialDays?: number;
    variant?: 'segmented' | 'pills';
    onTradesUpdate?: (trades: any[]) => void;
    onIntervalChange?: (interval: number | string) => void;
}

const liveTimeframes = [
    { label: '1S', value: '1s' },
    { label: '1M', value: '1m' },
];

const historicalTimeframes = [
    { label: '1D', value: 1 },
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 },
];

const CandlestickChart = ({ coinId, poolId, initialData, initialDays = 7, variant = 'segmented', onTradesUpdate, onIntervalChange }: CandlestickChartProps) => {
    const [days, setDays] = useState<number | string>(initialDays);
    const [data, setData] = useState<OHLC[]>(initialData || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (onIntervalChange) {
            onIntervalChange(days);
        }
    }, [days, onIntervalChange]);

    // Si el usuario selecciona 1s o 1m, usamos el hook de WebSocket.
    const { ohlcv: liveOhlcv, trades: liveTrades } = useCoinGeckoWebSocket({
        coinId,
        poolId: poolId || '0x0000000000000000000000000000000000000000',
        liveInterval: typeof days === 'string' ? (days as '1s' | '1m') : '1m'
    });

    useEffect(() => {
        if (onTradesUpdate && liveTrades.length > 0) {
            onTradesUpdate(liveTrades);
        }
    }, [liveTrades, onTradesUpdate]);

    useEffect(() => {
        if (liveOhlcv && typeof days === 'string') {
            setData(prev => {
                const newData = [...prev];
                const last = newData[newData.length - 1];
                if (last && last[0] === liveOhlcv[0]) {
                    newData[newData.length - 1] = liveOhlcv;
                    return newData;
                } else {
                    newData.push(liveOhlcv);
                    return newData.slice(-100);
                }
            });
        }
    }, [liveOhlcv, days]);

    useEffect(() => {
        if (typeof days === 'string') {
            setData([]); 
        }
    }, [days]);

    useEffect(() => {
        if (!coinId) return;
        if (typeof days === 'string') return;
        if (days === initialDays && initialData?.length) return;

        const controller = new AbortController();
        const run = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/ohlc?coinId=${coinId}&days=${days}`, { signal: controller.signal });
                const json = await res.json();
                setData(json.data || []);
            } catch (e) {
                if ((e as any).name !== 'AbortError') console.error(e);
            } finally {
                setLoading(false);
            }
        };
        run();
        return () => controller.abort();
    }, [coinId, days, initialDays, initialData?.length]);

    const seriesData = useMemo(() => data.map(([timestamp, open, high, low, close]) => ({
        x: new Date(timestamp),
        y: [open, high, low, close]
    })), [data]);

    const options: any = {
        chart: {
            type: 'candlestick',
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: false }
        },
        theme: { mode: 'dark' },
        xaxis: {
            type: 'datetime',
            labels: { style: { colors: '#71717a', fontSize: '10px' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: { colors: '#71717a', fontSize: '10px' },
                formatter: (val: number) => `$${val.toLocaleString()}`
            }
        },
        grid: { borderColor: '#27272a', strokeDashArray: 4 },
        plotOptions: {
            candlestick: {
                colors: { upward: '#22c55e', downward: '#ef4444' },
                wick: { useFillColor: true }
            }
        }
    };

    const timeframes = [
        { label: '1S', value: '1s' },
        { label: '1M', value: '1m' },
        { label: '1D', value: 1 },
        { label: '7D', value: 7 },
        { label: '30D', value: 30 },
        { label: '90D', value: 90 },
        { label: '1Y', value: 365 },
    ];

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 lg:p-6 shadow-lg relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white capitalize">{coinId.replace('-', ' ')} Performance</h2>
                    <p className="text-xs text-gray-500">Live market data & historical trends</p>
                </div>
                
                <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                    {timeframes.map((tf) => (
                        <button
                            key={tf.label}
                            onClick={() => setDays(tf.value)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                days === tf.value
                                    ? "bg-white text-black shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                            <span className="text-xs font-medium text-white">Updating...</span>
                        </div>
                    </div>
                )}
                <Chart
                    options={options}
                    series={[{ data: seriesData }]}
                    type="candlestick"
                    height={400}
                />
            </div>
        </div>
    );
};

export default memo(CandlestickChart);
