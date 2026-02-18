import React from 'react';
import { CoinMarketData } from "@/type.d";
import { getCoinMarkets } from "@/lib/coingecko.actions";
import CoinsTable from "@/components/coins/CoinsTable";

const CoinsPage = async () => {
    const coins = await getCoinMarkets({ per_page: 50, vs_currency: 'usd' });

    return (
        <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
                <p className="text-gray-400 mt-2">Top cryptocurrencies by market capitalization.</p>
            </header>

            <div className="bg-[#171717] border border-white/5 rounded-2xl overflow-hidden">
                <CoinsTable data={coins} />
            </div>
        </main>
    );
};

export default CoinsPage;
