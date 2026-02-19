import Image from "next/image";
import { CoinMarketData } from "@/type.d";

interface CoinOverviewProps {
    bitcoinData: CoinMarketData;
    thirtyDayChangePct?: number;
}

const CoinOverview = ({ bitcoinData, thirtyDayChangePct }: CoinOverviewProps) => {
    if (!bitcoinData) return null;

    return (
        <header className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
                <Image
                    src={bitcoinData.image}
                    alt={bitcoinData.name}
                    width={48}
                    height={48}
                    className="object-contain"
                />
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 font-medium uppercase">{bitcoinData.symbol} / USD</p>
                    <h1 className="text-3xl font-bold text-white">
                        ${bitcoinData.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h1>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-10">
                <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500 font-medium mb-1">24h Change ($)</p>
                    <p className={`text-lg font-semibold ${bitcoinData.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bitcoinData.price_change_24h >= 0 ? '+' : ''}
                        ${Math.abs(bitcoinData.price_change_24h).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500 font-medium mb-1">Daily Change (%)</p>
                    <p className={`text-lg font-semibold ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                        {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                    </p>
                </div>
                {typeof thirtyDayChangePct === 'number' && (
                    <div className="flex flex-col items-end border-l border-white/10 pl-8">
                        <p className="text-xs text-gray-500 font-medium mb-1">30d Change (%)</p>
                        <p className={`text-lg font-semibold ${thirtyDayChangePct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {thirtyDayChangePct >= 0 ? '+' : ''}
                            {thirtyDayChangePct.toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
        </header>
    );
};

export default CoinOverview;
