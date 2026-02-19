import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { getTrendingCoins } from "@/lib/coingecko.actions";

export const metadata: Metadata = {
  title: "Coinpulse",
  description: "Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { coins: trendingCoins } = await getTrendingCoins();

  return (
    <html lang="en" className="dark">
      <body
        className="antialiased"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
      <Header trendingCoins={trendingCoins} />
      <div className="pt-16">
        {children}
      </div>
      </body>
    </html>
  );
}
