'use client';

import React, { useMemo } from 'react';
import DataTable from '@/components/DataTable';
import { Trade, Ticker } from '@/type.d';
import { formatCurrency, timeAgo, cn } from '@/lib/utils';

interface RecentTradesProps {
    trades: Trade[];
    fallbackTickers?: Ticker[];
    isLoading?: boolean;
    interval?: string;
}

const RecentTrades = ({ trades, fallbackTickers, isLoading, interval }: RecentTradesProps) => {
    // Transformar tickers a formato Trade si no hay trades en vivo
    const displayTrades = useMemo(() => {
        if (trades.length > 0) return trades.slice(0, 15);
        
        if (!fallbackTickers || fallbackTickers.length === 0) return [];

        // Convertir Tickers a Trades
        return fallbackTickers
            .map(ticker => ({
                price: ticker.converted_last.usd,
                amount: undefined, // No siempre disponible en tickers de esta forma simplificada
                timestamp: new Date(ticker.timestamp).getTime(),
                type: 'buy', // Valor por defecto
                marketName: ticker.market.name
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 15);
    }, [trades, fallbackTickers]);

    const isLive = trades.length > 0;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">
                        {isLive ? 'Recent Trades' : 'Market Activity'}
                    </h3>
                    {interval && isLive && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold border border-red-500/20">
                            {interval.toUpperCase()}
                        </span>
                    )}
                </div>
                {isLive && (
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-[10px] text-green-500 font-bold uppercase">Live</span>
                    </div>
                )}
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 min-h-[400px] flex flex-col shadow-lg">
                {displayTrades.length > 0 ? (
                    <DataTable
                        columns={[
                            {
                                header: 'Time',
                                cell: ({ row }: { row: { original: any } }) => (
                                    <span className="text-gray-500 text-[10px]">
                                        {row.original.timestamp ? timeAgo(row.original.timestamp) : '---'}
                                    </span>
                                ),
                            },
                            {
                                header: 'Price',
                                cell: ({ row }: { row: { original: any } }) => (
                                    <span className={cn(
                                        "text-xs font-medium",
                                        row.original.type === 'buy' ? 'text-green-500' : 'text-red-500'
                                    )}>
                                        {formatCurrency(row.original.price)}
                                    </span>
                                ),
                            },
                            {
                                header: isLive ? 'Amount' : 'Exchange',
                                cell: ({ row }: { row: { original: any } }) => (
                                    <span className="text-gray-300 text-[10px] truncate max-w-[70px] block">
                                        {isLive 
                                            ? row.original.amount?.toLocaleString(undefined, { maximumFractionDigits: 4 })
                                            : row.original.marketName
                                        }
                                    </span>
                                ),
                            },
                            {
                                header: 'Side',
                                cell: ({ row }: { row: { original: any } }) => (
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase",
                                        row.original.type === 'buy' ? 'text-green-500' : 'text-red-500'
                                    )}>
                                        {row.original.type?.[0]}
                                    </span>
                                ),
                            },
                        ]}
                        data={displayTrades}
                        rowKey={(_, index) => index}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-sm text-gray-500">No recent activity</p>
                        <p className="text-[10px] text-gray-600 mt-2">
                            Select 1S or 1M interval for live trades.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTrades;
