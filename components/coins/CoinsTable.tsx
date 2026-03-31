"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import { CoinMarketData } from "@/type.d";

interface Props {
  data: CoinMarketData[];
}

const columns = [
  {
    header: "#",
    accessorKey: "market_cap_rank",
    cell: ({ row }: { row: { original: CoinMarketData } }) => (
      <p className="text-gray-400 font-medium">{row.original.market_cap_rank}</p>
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }: { row: { original: CoinMarketData } }) => {
      const coin = row.original;
      return (
        <Link href={`/?coin=${coin.id}`} className="flex items-center gap-2 hover:underline">
          <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
          <div className="flex flex-col">
            <p className="font-medium text-sm">{coin.name}</p>
            <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
          </div>
        </Link>
      );
    },
  },
  {
    header: "Price",
    accessorKey: "current_price",
    cell: ({ row }: { row: { original: CoinMarketData } }) => {
      const price = row.original.current_price;
      return (
        <p className="font-semibold">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      );
    },
  },
  {
    header: "24h Change ($)",
    accessorKey: "price_change_24h",
    cell: ({ row }: { row: { original: CoinMarketData } }) => {
      const change = row.original.price_change_24h;
      const isPositive = (change ?? 0) >= 0;
      return <p className={isPositive ? "text-green-500" : "text-red-500"}>{isPositive ? "+" : "-"}${Math.abs(change ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>;
    },
  },
  {
    header: "Daily Change (%)",
    accessorKey: "price_change_percentage_24h",
    cell: ({ row }: { row: { original: CoinMarketData } }) => {
      const change = row.original.price_change_percentage_24h;
      const isPositive = (change ?? 0) >= 0;
      return <p className={isPositive ? "text-green-500" : "text-red-500"}>{isPositive ? "+" : ""}{change?.toFixed(2)}%</p>;
    },
  },
  {
    header: "Market Cap",
    accessorKey: "market_cap",
    cell: ({ row }: { row: { original: CoinMarketData } }) => {
      const marketCap = row.original.market_cap;
      return <p className="font-medium">{(marketCap / 1e9).toFixed(2)}B</p>;
    },
  },
];

export default function CoinsTable({ data }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(row: { original: CoinMarketData }, index: number) => row.original.id ?? index}
    />
  );
}
