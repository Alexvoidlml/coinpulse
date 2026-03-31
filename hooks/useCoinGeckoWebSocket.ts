'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    UseCoinGeckoWebSocketProps, 
    UseCoinGeckoWebSocketReturn, 
    WebSocketMessage, 
    ExtendedPriceData, 
    Trade, 
    OHLCData 
} from '@/type.d';

/**
 * Hook para manejar la conexión WebSocket de CoinGecko (o GeckoTerminal para pools)
 * Nota: El WebSocket de CoinGecko para precios en tiempo real de coins específicos
 * suele estar más orientado a GeckoTerminal para datos de pools de DEXs.
 * 
 * En este caso, basándome en los tipos de `type.d.ts`, implementaremos uno 
 * compatible con lo que parece ser la estructura de GeckoTerminal/CoinGecko.
 */
export const useCoinGeckoWebSocket = ({ 
    coinId, 
    poolId, 
    liveInterval = '1m' 
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    const socketRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        // En un entorno real, la URL vendría de env vars o documentación oficial.
        // GeckoTerminal usa: wss://app.geckoterminal.com/cable
        const wsUrl = 'wss://app.geckoterminal.com/cable';
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket Connected');

            // Suscribirse a los canales necesarios según la estructura de GeckoTerminal/ActionCable
            const subscribePrice = {
                command: 'subscribe',
                identifier: JSON.stringify({
                    channel: 'PoolChannel',
                    pool_id: poolId,
                    interval: liveInterval === '1s' ? '1s' : '1m'
                }),
            };
            
            socket.send(JSON.stringify(subscribePrice));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // Manejar mensajes de ActionCable/GeckoTerminal
            if (data.type === 'ping') return;
            
            if (data.message) {
                const msg = data.message as WebSocketMessage;
                
                // Actualizar precio
                if (msg.p || msg.c) {
                    const currentPrice = msg.p || msg.c || 0;
                    setPrice({
                        usd: currentPrice,
                        price: currentPrice,
                        timestamp: msg.t ? msg.t * 1000 : Date.now(),
                    });
                }

                // Actualizar trades
                if (msg.ty === 'trade') {
                    const newTrade: Trade = {
                        price: msg.p,
                        amount: msg.v,
                        timestamp: msg.t ? msg.t * 1000 : Date.now(),
                        type: msg.s === 'buy' ? 'buy' : 'sell',
                    };
                    setTrades((prev) => [newTrade, ...prev].slice(0, 50));
                }

                // Actualizar OHLCV
                if (msg.o && msg.h && msg.l && msg.c) {
                    const newOhlc: OHLCData = [
                        msg.t ? msg.t * 1000 : Date.now(),
                        msg.o,
                        msg.h,
                        msg.l,
                        msg.c
                    ];
                    setOhlcv(newOhlc);
                }
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket Disconnected. Retrying...');
            // Intento de reconexión tras 5 segundos
            setTimeout(connect, 5000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            socket.close();
        };

    }, [poolId, liveInterval]);

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect]);

    return {
        price,
        trades,
        ohlcv,
        isConnected
    };
};
