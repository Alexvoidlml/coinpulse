import { NextRequest } from 'next/server';
import { getCoinOHLC } from '@/lib/coingecko.actions';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coinId = searchParams.get('coinId') || 'bitcoin';
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 7;

    if (!coinId) {
      return new Response(JSON.stringify({ error: 'coinId is required' }), { status: 400 });
    }

    const data = await getCoinOHLC(coinId, days);

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), { status: 500 });
  }
}
