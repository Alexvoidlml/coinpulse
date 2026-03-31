'use client';

import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchItemProps } from "@/type.d";

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
    const router = useRouter();

    const handleClick = () => {
        onSelect(coin.id);
        router.push(`/?coin=${coin.id}`);
    };

    const getCoinIcon = () => {
        if ('thumb' in coin) return (coin as any).thumb;
        if ('large' in coin) return (coin as any).large;
        return '';
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                isActiveName ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-3">
                <Image
                    src={getCoinIcon() || ''}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                />
                <div className="flex flex-col items-start">
                    <p className="text-sm font-medium text-white">{coin.name}</p>
                    <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                </div>
            </div>

            {coin.market_cap_rank && (
                <div className="bg-white/5 px-2 py-1 rounded text-[10px] text-gray-400">
                    #{coin.market_cap_rank}
                </div>
            )}
        </button>
    );
};

export default SearchItem;
