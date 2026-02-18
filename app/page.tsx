import React from 'react';
import { getTrendingCoins, getCategories, getCoinMarkets } from "@/lib/coingecko.actions";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";

import { TrendingCoin, Category } from "@/type.d";

const Page = async () => {
    const [
        { coins: trendingCoins },
        categories,
        bitcoinData
    ] = await Promise.all([
        getTrendingCoins(),
        getCategories(),
        getCoinMarkets({ ids: 'bitcoin' }).then(res => res[0])
    ]);

    return (
        <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white">
            <section className="max-w-7xl mx-auto">
                <div id="coin-overview" className="w-full">
                    <CoinOverview bitcoinData={bitcoinData} />
                    <TrendingCoins trendingCoins={trendingCoins} />
                </div>

                <section className="w-full mt-12">
                    <h2 className="text-xl font-bold mb-6 tracking-tight">Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories && categories.length > 0 ? (
                            categories.slice(0, 6).map((category: Category, index: number) => (
                                <div key={index} className="bg-[#171717] border border-white/5 rounded-2xl p-6">
                                    <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="text-gray-400">Market Cap</p>
                                        <p className="font-medium">${(category.market_cap / 1e9).toFixed(2)}B</p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-2">
                                        <p className="text-gray-400">24h Change</p>
                                        <p className={category.market_cap_change_24h >= 0 ? "text-green-500" : "text-red-500"}>
                                            {category.market_cap_change_24h.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">No categories found.</div>
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
};

export default Page;