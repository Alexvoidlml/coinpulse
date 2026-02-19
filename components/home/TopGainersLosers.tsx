'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CoinMarketData } from '@/type.d';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopGainersLosersProps {
    gainers: CoinMarketData[];
    losers: CoinMarketData[];
}

const CoinList = ({ coins, type }: { coins: CoinMarketData[], type: 'gainers' | 'losers' }) => {
    return (
        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
                {type === 'gainers' ? (
                    <TrendingUp size={18} className="text-green-500" />
                ) : (
                    <TrendingDown size={18} className="text-red-500" />
                )}
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Top {type === 'gainers' ? 'Gainers' : 'Losers'} (24h)
                </h3>
            </div>
            <div className="divide-y divide-white/5">
                {coins.length > 0 ? (
                    coins.map((coin) => (
                        <Link 
                            key={coin.id} 
                            href={`/?coin=${coin.id}`}
                            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black/20 border border-white/5 p-1">
                                    <Image 
                                        src={coin.image} 
                                        alt={coin.name} 
                                        fill 
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {coin.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                                        {coin.symbol}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-white">
                                    {formatCurrency(coin.current_price)}
                                </p>
                                <p className={cn(
                                    "text-[10px] font-black",
                                    coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                                )}>
                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {formatPercentage(coin.price_change_percentage_24h)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500 text-xs">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

const TopGainersLosers = ({ gainers, losers }: TopGainersLosersProps) => {
    return (
        <div className="mt-16">
            <div className="flex items-center gap-3 mb-8 px-1">
                <div className="w-2 h-5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                <h2 className="text-xl font-bold text-white capitalize">Market Movers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CoinList coins={gainers} type="gainers" />
                <CoinList coins={losers} type="losers" />
            </div>
        </div>
    );
};

export default TopGainersLosers;
