"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import { TrendingCoin } from "@/type.d";

const columns = [
    {
        header: "Name",
        accessorKey: "item.name",
        cell: ({ row }: { row: { original: TrendingCoin } }) => {
            const { item } = row.original;
            return (
                <Link
                    href={`/coins/${item.id}`}
                    className="flex items-center gap-2 hover:underline"
                >
                    <Image
                        src={item.large}
                        alt={item.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <p className="font-medium text-sm lg:text-base">{item.name}</p>
                </Link>
            );
        },
    },
    {
        header: "Symbol",
        accessorKey: "item.symbol",
        cell: ({ row }: { row: { original: TrendingCoin } }) => {
            return (
                <p className="text-gray-400 font-medium uppercase text-xs">
                    {row.original.item.symbol}
                </p>
            );
        },
    },
    {
        header: "Price",
        accessorKey: "item.data.price",
        cell: ({ row }: { row: { original: TrendingCoin } }) => {
            const price = row.original.item.data.price;
            return (
                <p className="font-semibold">
                    ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </p>
            );
        },
    },
    {
        header: "24h Change",
        accessorKey: "item.data.price_change_percentage_24h.usd",
        cell: ({ row }: { row: { original: TrendingCoin } }) => {
            const change = row.original.item.data.price_change_percentage_24h.usd;
            const isPositive = change >= 0;
            return (
                <p className={isPositive ? "text-green-500" : "text-red-500 font-medium"}>
                    {isPositive ? "+" : ""}{change.toFixed(2)}%
                </p>
            );
        },
    },
];

const TrendingCoins = ({ trendingCoins }: { trendingCoins: TrendingCoin[] }) => {
    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 tracking-tight">Trending Coins</h2>
            <div className="bg-[#171717] border border-white/5 rounded-2xl overflow-hidden">
                <DataTable
                    columns={columns}
                    data={trendingCoins}
                    rowKey={(row: { original: TrendingCoin }) => row.original.item.id}
                />
            </div>
        </div>
    );
};

export default TrendingCoins;
