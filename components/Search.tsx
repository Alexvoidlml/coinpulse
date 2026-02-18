'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchCoins } from "@/lib/coingecko.actions";
import { SearchCoin, TrendingCoin } from "@/type.d";
import SearchItem from "./SearchItem";

interface SearchProps {
    trendingCoins: TrendingCoin[];
}

const Search = ({ trendingCoins }: SearchProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchCoin[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const { coins } = await searchCoins(query);
                setResults(coins.slice(0, 8));
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 500);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-gray-400 hover:bg-white/10 transition-all">
                    <SearchIcon size={18} />
                    <span className="text-sm hidden sm:inline">Search coins...</span>
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-[#0a0a0a] border-white/10 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-white/5">
                    <DialogTitle className="hidden">Search Coins</DialogTitle>
                    <div className="relative flex items-center">
                        <SearchIcon className="absolute left-3 text-gray-400" size={18} />
                        <Input
                            placeholder="Type to search..."
                            className="pl-10 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-500"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        />
                        {loading && (
                            <Loader2 className="absolute right-3 animate-spin text-gray-500" size={18} />
                        )}
                    </div>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {query.length < 2 ? (
                        <div>
                            <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Trending Now
                            </p>
                            <div className="space-y-1">
                                {trendingCoins.slice(0, 5).map((coin) => (
                                    <SearchItem
                                        key={coin.item.id}
                                        coin={coin.item}
                                        onSelect={() => setOpen(false)}
                                        isActiveName={false}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {results.length > 0 ? (
                                results.map((coin) => (
                                    <SearchItem
                                        key={coin.id}
                                        coin={coin}
                                        onSelect={() => setOpen(false)}
                                        isActiveName={false}
                                    />
                                ))
                            ) : !loading && (
                                <p className="text-center py-4 text-gray-400 text-sm">
                                    No results found for "{query}"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Search;
