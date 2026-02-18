'use client';

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import { cn } from "@/lib/utils";
import Search from "./Search";
import { HeaderProps } from "@/type.d";

const Header = ({ trendingCoins }: HeaderProps) => {
    const pathname = usePathname();
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
            <div className="main-container flex items-center justify-between h-16 px-4 lg:px-10">

                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="CoinPulse logo"
                            width={32}
                            height={32}
                        />
                        <span className="font-bold text-xl tracking-tight hidden sm:block">CoinPulse</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={cn("text-sm font-medium transition-colors hover:text-white", 
                                pathname === "/" ? "text-white" : "text-gray-400"
                            )}
                        >Home</Link>

                        <Link
                            href="/coins"
                            className={cn("text-sm font-medium transition-colors hover:text-white",
                                pathname === "/coins" ? "text-white" : "text-gray-400"
                            )}
                        >All Coins</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Search trendingCoins={trendingCoins} />
                </div>

            </div>
        </header>
    );
};
export default Header;