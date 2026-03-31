'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { Ticker } from '@/type.d';
import { formatCurrency } from '@/lib/utils';

interface ExchangeListingsProps {
    tickers: Ticker[];
}

const columns = [
    {
        header: 'Exchange',
        cell: ({ row }: { row: { original: Ticker } }) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black border border-white/5 shadow-inner">
                    {row.original.market.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-white tracking-tight">{row.original.market.name}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{row.original.base}/{row.original.target}</span>
                </div>
            </div>
        ),
    },
    {
        header: 'Price',
        cell: ({ row }: { row: { original: Ticker } }) => (
            <span className="text-sm font-mono font-bold text-blue-400">
                {formatCurrency(row.original.converted_last.usd)}
            </span>
        ),
    },
    {
        header: 'Action',
        cell: ({ row }: { row: { original: Ticker } }) => (
            <a 
                href={row.original.trade_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
                <ExternalLink size={14} />
            </a>
        ),
    },
];

const ExchangeListings = ({ tickers }: ExchangeListingsProps) => {
    return (
        <div className="flex flex-col h-full group">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Markets</h3>
            </div>
            <div className="bg-[#171717] border border-white/5 rounded-2xl overflow-hidden flex-1 min-h-[400px] shadow-2xl transition-all duration-500 group-hover:border-white/10">
                <DataTable
                    columns={columns}
                    data={tickers.slice(0, 10)}
                    rowKey={(row, index) => `${row.original.market.name}-${index}`}
                    tableClassName="border-0 bg-transparent"
                    bodyCellClassName="py-3 px-4"
                    headerRowClassName="bg-black/40 border-b border-white/5"
                    bodyRowClassName="hover:bg-white/[0.02] border-b border-white/5 last:border-0"
                />
            </div>
        </div>
    );
};

export default ExchangeListings;
