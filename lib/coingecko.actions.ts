'use server';

import qs from 'query-string';
import { 
    CoinDetailsData, 
    CoinMarketData, 
    TrendingCoin, 
    Category, 
    SearchCoin, 
    CoinGeckoErrorBody, 
    QueryParams 
} from '@/type.d';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if(!BASE_URL) throw new Error('COINGECKO_BASE_URL environment variable is missing');
if(!API_KEY) throw new Error('COINGECKO_API_KEY environment variable is missing');

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 1,
): Promise<T> {
    const isPro = BASE_URL?.includes('pro-api.coingecko.com');
    
    const url = qs.stringifyUrl({
        url: `${BASE_URL}${endpoint}`,
        query: {
            ...params,
            [isPro ? 'x_cg_pro_api_key' : 'x_cg_demo_api_key']: API_KEY,
        },
    });

    try {
        const response = await fetch(url, {
            next: {
                revalidate,
            },
        });

        if (!response.ok) {
            const errorBody = (await response.json()) as CoinGeckoErrorBody;
            throw new Error(
                `CoinGecko API Error: ${response.status} ${response.statusText} - ${errorBody.error || 'Unknown error'}`
            );
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export async function getTrendingCoins() {
    return await fetcher<{ coins: TrendingCoin[] }>('/search/trending');
}

export async function getCoinMarkets(params?: QueryParams) {
    return await fetcher<CoinMarketData[]>('/coins/markets', {
        vs_currency: 'usd',
        order: params?.order || 'market_cap_desc',
        per_page: params?.per_page || 20,
        page: params?.page || 1,
        sparkline: false,
        price_change_percentage: '24h',
        ...params,
    });
}

export async function getCoinDetails(id: string) {
    return await fetcher<CoinDetailsData>(`/coins/${id}`, {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
    });
}

export async function getCategories() {
    return await fetcher<Category[]>('/coins/categories');
}

export async function searchCoins(query: string) {
    return await fetcher<{ coins: SearchCoin[] }>('/search', { query });
}

export async function getCoinOHLC(id: string, days: number = 1) {
    return await fetcher<[number, number, number, number, number][]>(`/coins/${id}/ohlc`, {
        vs_currency: 'usd',
        days: days,
    });
}