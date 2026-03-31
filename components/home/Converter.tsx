'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Coins } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

interface ConverterProps {
    symbol: string;
    icon: string;
    currentPrice: number; // en USD
    name: string;
    fiatPrices?: Record<string, number>;
}

const Converter = ({ symbol, icon, currentPrice, name, fiatPrices }: ConverterProps) => {
    const [cryptoAmount, setCryptoAmount] = useState<string>('1');
    const [fiatAmount, setFiatAmount] = useState<string>(currentPrice.toString());
    const [selectedFiat, setSelectedFiat] = useState<string>('usd');

    // Lista de monedas fiat comunes para el selector
    const fiats = [
        { id: 'usd', symbol: '$', label: 'USD' },
        { id: 'eur', symbol: '€', label: 'EUR' },
        { id: 'gbp', symbol: '£', label: 'GBP' },
        { id: 'jpy', symbol: '¥', label: 'JPY' },
    ];

    const getPrice = () => {
        if (fiatPrices && fiatPrices[selectedFiat]) {
            return fiatPrices[selectedFiat];
        }
        return currentPrice;
    };

    useEffect(() => {
        const price = getPrice();
        const amount = parseFloat(cryptoAmount);
        if (!isNaN(amount)) {
            setFiatAmount((amount * price).toFixed(2));
        } else {
            setFiatAmount('');
        }
    }, [cryptoAmount, selectedFiat, currentPrice, fiatPrices]);

    const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCryptoAmount(val);
        const amount = parseFloat(val);
        if (!isNaN(amount)) {
            setFiatAmount((amount * getPrice()).toFixed(2));
        } else {
            setFiatAmount('');
        }
    };

    const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFiatAmount(val);
        const amount = parseFloat(val);
        if (!isNaN(amount)) {
            setCryptoAmount((amount / getPrice()).toFixed(6));
        } else {
            setCryptoAmount('');
        }
    };

    return (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <ArrowRightLeft size={20} className="text-blue-500" />
                <h3 className="text-lg font-bold text-white uppercase">Currency Converter</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Amount ({symbol.toUpperCase()})</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Image src={icon} alt={name} width={24} height={24} className="rounded-full" />
                        </div>
                        <Input
                            type="number"
                            value={cryptoAmount}
                            onChange={handleCryptoChange}
                            className="pl-12 bg-white/5 border-white/10 text-white"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <ArrowRightLeft size={24} className="text-gray-600 rotate-90" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400 font-medium">Converted Amount</label>
                        <select
                            value={selectedFiat}
                            onChange={(e) => setSelectedFiat(e.target.value)}
                            className="bg-transparent text-xs font-bold text-white uppercase outline-none cursor-pointer"
                        >
                            {fiats.map(f => (
                                <option key={f.id} value={f.id} className="bg-black">{f.label}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        type="number"
                        value={fiatAmount}
                        onChange={handleFiatChange}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="0.00"
                    />
                </div>

                <div className="pt-2">
                    <p className="text-[10px] text-gray-500 text-center italic font-medium">
                        1 {symbol.toUpperCase()} ≈ {getPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedFiat.toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Converter;
