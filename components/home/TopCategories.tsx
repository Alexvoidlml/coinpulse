"use client";
import React from 'react';
import { Category } from "@/type.d";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface TopCategoriesProps {
    categories: Category[];
}

const TopCategories = ({ categories }: TopCategoriesProps) => {
    if (!categories || categories.length === 0) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-6 tracking-tight">Top Categories</h2>
                <div className="text-gray-500 text-sm bg-[#171717] border border-white/5 rounded-2xl p-6">
                    No se encontraron categorías.
                </div>
            </div>
        );
    }

    // Tomamos las primeras 6 para que se vea bien en la rejilla
    const topCategories = categories.slice(0, 6);

    return (
        <div className="mt-16 group">
            <div className="flex items-center gap-3 mb-8 px-1">
                <div className="w-2 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                <h2 className="text-xl font-bold text-white capitalize">Sector Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topCategories.map((category, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <div 
                                className="bg-[#171717] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-500 group/card shadow-2xl relative overflow-hidden cursor-pointer"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                
                                <div className="flex justify-between items-start mb-6 gap-3 relative">
                                    <h3 className="font-black text-lg text-white group-hover/card:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem] flex-1 tracking-tight leading-tight">
                                        {category.name}
                                    </h3>
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tighter shadow-sm border ${
                                        category.market_cap_change_24h >= 0 
                                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                    }`}>
                                        {formatPercentage(category.market_cap_change_24h)}
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Market Cap</span>
                                            <p className="font-mono text-xs font-bold text-gray-200">
                                                {formatCurrency(category.market_cap, 0)}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-1 text-right">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">24h Volume</span>
                                            <p className="font-mono text-xs font-bold text-gray-200">
                                                {formatCurrency(category.volume_24h, 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {category.top_3_coins && category.top_3_coins.length > 0 && (
                                        <div className="pt-5 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-black">Dominant Assets</p>
                                                <div className="flex -space-x-2">
                                                    {category.top_3_coins.map((coinUrl, i) => (
                                                        <div key={i} className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#171717] bg-black/40 hover:z-10 transition-transform hover:scale-125">
                                                            <Image 
                                                                src={coinUrl} 
                                                                alt="coin" 
                                                                fill 
                                                                className="object-contain p-1"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tight text-white mb-4">
                                    {category.name} Detailed Analysis
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-white/5 mt-4">
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Market Capitalization</p>
                                        <p className="text-xl font-mono font-bold text-white">
                                            {formatCurrency(category.market_cap)}
                                        </p>
                                        <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            category.market_cap_change_24h >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                                        }`}>
                                            {category.market_cap_change_24h >= 0 ? "+" : ""}{formatPercentage(category.market_cap_change_24h)} in 24h
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Trading Volume (24h)</p>
                                        <p className="text-xl font-mono font-bold text-white">
                                            {formatCurrency(category.volume_24h)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Leading Assets in Sector</p>
                                        <div className="flex flex-wrap gap-4">
                                            {category.top_3_coins?.map((coinUrl, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2">
                                                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-2 shadow-lg group-hover:scale-110 transition-transform">
                                                        <Image 
                                                            src={coinUrl} 
                                                            alt="coin" 
                                                            fill 
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Asset #{i+1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                                        <p className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-tight">Sector Insights</p>
                                        <p className="text-xs text-gray-400 leading-relaxed italic">
                                            This sector represents the market activity of assets categorized under {category.name}. 
                                            The {category.market_cap_change_24h >= 0 ? 'growth' : 'contraction'} of {Math.abs(category.market_cap_change_24h).toFixed(2)}% reflects the current sentiment in this specific market segment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
        </div>
    );
};

export default TopCategories;
