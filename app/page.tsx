'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTrendingCoins, getCategories, getCoinMarkets, getCoinOHLC, getCoinDetails } from "@/lib/coingecko.actions";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoins";
import CandlestickChart from "@/components/CandlestickChart";
import TopCategories from "@/components/home/TopCategories";
import RecentTrades from "@/components/home/RecentTrades";
import ExchangeListings from "@/components/home/ExchangeListings";
import Converter from "@/components/home/Converter";
import CoinDetails from "@/components/home/CoinDetails";
import TopGainersLosers from "@/components/home/TopGainersLosers";

import { Category, CoinMarketData, TrendingCoin, CoinDetailsData, Trade } from "@/type.d";

const Dashboard = () => {
    const searchParams = useSearchParams();
    const coinId = searchParams.get('coin') || 'bitcoin';

    const [data, setData] = React.useState<{
        trendingCoins: TrendingCoin[];
        categories: Category[];
        coinData: CoinMarketData;
        ohlcData: [number, number, number, number, number][];
        coinDetails: CoinDetailsData;
        poolId: string;
        gainers: CoinMarketData[];
        losers: CoinMarketData[];
    } | null>(null);
    const [liveTrades, setLiveTrades] = useState<Trade[]>([]);
    const [activeInterval, setActiveInterval] = useState<number | string>(7);

    React.useEffect(() => {
        // Limpiar trades cuando cambia la moneda o el intervalo
        setLiveTrades([]);
    }, [coinId, activeInterval]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { coins: trendingCoins },
                    categories,
                    coinMarkets,
                    ohlcData,
                    coinDetails,
                    gainers,
                    losers
                ] = await Promise.all([
                    getTrendingCoins(),
                    getCategories(),
                    getCoinMarkets({ ids: coinId }),
                    getCoinOHLC(coinId, 7),
                    getCoinDetails(coinId),
                    getCoinMarkets({ order: 'price_change_percentage_24h_desc', per_page: 5 }),
                    getCoinMarkets({ order: 'price_change_percentage_24h_asc', per_page: 5 })
                ]);

                // Intentar extraer el pool address (poolId) de los detalles de la moneda.
                // Usamos la primera red disponible si existe.
                let poolId = '0x0000000000000000000000000000000000000000'; // fallback
                if (coinDetails.detail_platforms) {
                    const platforms = Object.values(coinDetails.detail_platforms);
                    if (platforms.length > 0 && platforms[0].contract_address) {
                        poolId = platforms[0].contract_address;
                    }
                }

                setData({
                    trendingCoins,
                    categories,
                    coinData: coinMarkets[0],
                    ohlcData,
                    coinDetails,
                    poolId,
                    gainers,
                    losers
                });
            } catch (error) {
                console.error("Error fetching coin data:", error);
            }
        };
        fetchData();
    }, [coinId]);

    if (!data) return (
        <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
        </main>
    );

    const { trendingCoins, categories, coinData, ohlcData, coinDetails, poolId, gainers, losers } = data;

    return (
        <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                <div id="coin-overview" className="w-full">
                    <CoinOverview 
                        bitcoinData={coinData} 
                        thirtyDayChangePct={coinDetails?.market_data?.price_change_percentage_30d_in_currency?.usd}
                    />
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3">
                        <CandlestickChart 
                            coinId={coinId}
                            poolId={poolId}
                            initialData={ohlcData} 
                            initialDays={7} 
                            variant="segmented" 
                            onTradesUpdate={setLiveTrades}
                            onIntervalChange={setActiveInterval}
                        />
                        <div className="mt-8">
                            <CoinDetails coin={coinDetails} />
                        </div>
                    </div>
                    <div className="xl:col-span-1 space-y-6">
                        <Converter 
                            symbol={coinData.symbol}
                            icon={coinData.image}
                            currentPrice={coinData.current_price}
                            name={coinData.name}
                            fiatPrices={coinDetails.market_data.current_price}
                        />
                        <RecentTrades 
                            trades={liveTrades} 
                            fallbackTickers={coinDetails.tickers}
                            isLoading={typeof activeInterval === 'string'} 
                            interval={typeof activeInterval === 'string' ? activeInterval : undefined}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TrendingCoins trendingCoins={trendingCoins} />
                    </div>
                    <div className="lg:col-span-1 pt-8">
                        <ExchangeListings tickers={coinDetails.tickers} />
                    </div>
                </div>

                <TopCategories categories={categories} />

                <TopGainersLosers gainers={gainers} losers={losers} />
            </div>
        </main>
    );
};

const Page = () => {
    return (
        <Suspense fallback={
            <main className="main-container p-4 lg:p-10 bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center">
                <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
            </main>
        }>
            <Dashboard />
        </Suspense>
    );
};

export default Page;