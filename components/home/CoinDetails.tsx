'use client';

import React, { useState } from 'react';
import { Info, Globe, Link as LinkIcon, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { CoinDetailsData } from '@/type.d';
import { cn } from '@/lib/utils';

interface CoinDetailsProps {
    coin: CoinDetailsData;
}

const CoinDetails = ({ coin }: CoinDetailsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!coin) return null;

    const homepage = coin.links?.homepage?.[0];
    const blockchain = coin.links?.blockchain_site?.[0];
    const reddit = coin.links?.subreddit_url;
    const description = coin.description?.en;

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <Info size={20} className="text-blue-500" />
                <h3 className="text-lg font-bold text-white uppercase">About {coin.name}</h3>
                <span className="ml-auto bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 border border-white/10">
                    RANK #{coin.market_cap_rank}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <div className={cn(
                        "text-sm text-gray-400 leading-relaxed overflow-hidden transition-all duration-300",
                        !isExpanded && "max-h-32 mask-fade-bottom"
                    )}
                    dangerouslySetInnerHTML={{ __html: description || 'No description available.' }}
                    />
                    
                    {description && description.length > 300 && (
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 mt-2 text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors"
                        >
                            {isExpanded ? (
                                <>Show Less <ChevronUp size={14} /></>
                            ) : (
                                <>Read More <ChevronDown size={14} /></>
                            )}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resources</h4>
                    <div className="flex flex-col gap-2">
                        {homepage && (
                            <a 
                                href={homepage} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-sm text-white group"
                            >
                                <Globe size={16} className="text-gray-400 group-hover:text-blue-400" />
                                <span>Official Website</span>
                            </a>
                        )}
                        {blockchain && (
                            <a 
                                href={blockchain} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-sm text-white group"
                            >
                                <LinkIcon size={16} className="text-gray-400 group-hover:text-blue-400" />
                                <span>Explorer</span>
                            </a>
                        )}
                        {reddit && (
                            <a 
                                href={reddit} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-sm text-white group"
                            >
                                <MessageSquare size={16} className="text-gray-400 group-hover:text-blue-400" />
                                <span>Community</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mask-fade-bottom {
                    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
                    mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
                }
            `}</style>
        </div>
    );
};

export default CoinDetails;
