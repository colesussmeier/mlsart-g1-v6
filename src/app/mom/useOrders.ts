"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { queryOrders } from '../actions/queryOrders';
import type { OutstandingOrder } from '../actions/adminTypes';
import { callAdmin } from './adminClient';

export type ShippedOrder = {
    order: OutstandingOrder;
    emailed: boolean;
    trackingLink: string;
};

const BACKGROUND_REFRESH_MS = 2 * 60 * 1000;
const MIN_REFRESH_GAP_MS = 15 * 1000;

export function useOrders() {
    const [orders, setOrders] = useState<OutstandingOrder[] | null>(null);
    const [shipped, setShipped] = useState<ShippedOrder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [checkedAt, setCheckedAt] = useState<Date | null>(null);

    const latestRequest = useRef(0);
    const lastStarted = useRef(0);
    // A load that started before an order was shipped would otherwise bring it back.
    const shippedIds = useRef(new Set<string>());

    const refresh = useCallback(async () => {
        const request = ++latestRequest.current;
        lastStarted.current = Date.now();
        setRefreshing(true);
        const result = await callAdmin(queryOrders);
        if (request !== latestRequest.current) return;

        setRefreshing(false);
        if (result.ok) {
            setOrders(result.data.filter(order => !shippedIds.current.has(order.id)));
            setError(null);
            setCheckedAt(new Date());
        } else {
            setError(result.error);
        }
    }, []);

    useEffect(() => {
        refresh();

        const refreshIfStale = () => {
            if (document.visibilityState === 'visible' && Date.now() - lastStarted.current > MIN_REFRESH_GAP_MS) {
                refresh();
            }
        };
        const timer = setInterval(refreshIfStale, BACKGROUND_REFRESH_MS);
        window.addEventListener('focus', refreshIfStale);
        document.addEventListener('visibilitychange', refreshIfStale);
        return () => {
            clearInterval(timer);
            window.removeEventListener('focus', refreshIfStale);
            document.removeEventListener('visibilitychange', refreshIfStale);
        };
    }, [refresh]);

    const markShipped = useCallback((entry: ShippedOrder) => {
        shippedIds.current.add(entry.order.id);
        setOrders(current => current?.filter(order => order.id !== entry.order.id) ?? current);
        setShipped(current => [...current, entry]);
    }, []);

    const dismissShipped = useCallback((orderId: string) => {
        setShipped(current => current.filter(entry => entry.order.id !== orderId));
    }, []);

    return { orders, shipped, error, refreshing, checkedAt, refresh, markShipped, dismissShipped };
}
