import React from 'react';
import Image from "next/image";
import { NextPageProps } from '@/type.d';
import { getCoinDetails } from "@/lib/coingecko.actions";

const CoinDetailsPage = async ({ params }: NextPageProps) => {
    const { id } = await params;
    const coin = await getCoinDetails(id);

    return (
        <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white">
            <section className="max-w-7xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Image
                        src={coin.image.large}
                        alt={coin.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-bold tracking-tight">{coin.name}</h1>
                            <span className="bg-white/10 px-2 py-1 rounded text-sm text-gray-400 uppercase font-medium">
                                {coin.symbol}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium">Rank #{coin.market_cap_rank}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Price Section */}
                        <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-400 font-medium">{coin.name} Price ({coin.symbol.toUpperCase()})</p>
                                <div className="flex items-end gap-3 mt-1">
                                    <h2 className="text-5xl font-bold">${coin.market_data.current_price.usd.toLocaleString()}</h2>
                                    <span className={`text-lg font-bold mb-1 ${
                                        coin.market_data.price_change_percentage_24h_in_currency.usd >= 0 
                                        ? "text-green-500" : "text-red-500"
                                    }`}>
                                        {coin.market_data.price_change_percentage_24h_in_currency.usd >= 0 ? "+" : ""}
                                        {coin.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">About {coin.name}</h3>
                            <div 
                                className="text-gray-400 leading-relaxed text-sm lg:text-base prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: coin.description.en }}
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Market Stats */}
                        <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-6 tracking-tight">Market Stats</h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <p className="text-gray-400 text-sm">Market Cap</p>
                                    <p className="font-bold text-sm">${coin.market_data.market_cap.usd.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <p className="text-gray-400 text-sm">24h Volume</p>
                                    <p className="font-bold text-sm">${coin.market_data.total_volume.usd.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <p className="text-gray-400 text-sm">24h High</p>
                                    <p className="font-bold text-sm text-green-500">
                                        ${coin.market_data.high_24h?.usd?.toLocaleString() || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-400 text-sm">24h Low</p>
                                    <p className="font-bold text-sm text-red-500">
                                        ${coin.market_data.low_24h?.usd?.toLocaleString() || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CoinDetailsPage;
