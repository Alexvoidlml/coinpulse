import Image from "next/image";
import { CoinMarketData } from "@/type.d";

interface CoinOverviewProps {
    bitcoinData: CoinMarketData;
}

const CoinOverview = ({ bitcoinData }: CoinOverviewProps) => {
    if (!bitcoinData) return null;

    return (
        <header className="bg-[#171717] border border-white/5 rounded-2xl p-6 flex items-center gap-5">
            <Image
                src={bitcoinData.image}
                alt={bitcoinData.name}
                width={56}
                height={56}
                className="object-contain"
            />
            <div className="flex flex-col">
                <p className="text-xs text-gray-400 font-medium">{bitcoinData.name} / {bitcoinData.symbol.toUpperCase()}</p>
                <h1 className="text-3xl font-bold tracking-tight">
                    ${bitcoinData.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h1>
            </div>
            <div className="ml-auto hidden sm:flex flex-col items-end">
                <p className="text-xs text-gray-400 font-medium">24h Change</p>
                <p className={`text-lg font-bold ${bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bitcoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                    {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        </header>
    );
};

export default CoinOverview;
