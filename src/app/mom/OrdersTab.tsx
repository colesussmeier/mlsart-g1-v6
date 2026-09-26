"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { OrderAddress, OrderItem, OutstandingOrder } from '../actions/adminTypes';
import { shipOrder } from '../actions/shipOrder';
import { checkTrackingLink } from '../actions/trackingLink';
import { callAdmin, formatMoney, formatOrderDate } from './adminClient';
import { Button, CopyButton, Notice, Spinner } from './ui';
import type { ShippedOrder, useOrders } from './useOrders';

type OrdersState = ReturnType<typeof useOrders>;

export default function OrdersTab({ state }: { state: OrdersState }) {
    const { orders, shipped, error, refreshing, checkedAt, refresh, markShipped, dismissShipped } = state;

    if (orders === null) {
        return error ? (
            <div className="space-y-4">
                <Notice tone="error" title="The orders didn't load">{error}</Notice>
                <Button onClick={refresh} busy={refreshing} busyLabel="Trying again…">Try again</Button>
            </div>
        ) : (
            <div className="flex items-center gap-3 py-16 justify-center text-xl text-gray-600">
                <Spinner className="h-7 w-7" /> Loading your orders…
            </div>
        );
    }

    // Shipped cards stay where the order was, so the page doesn't jump when one is sent.
    const cards = [
        ...orders.map(order => ({ order, shipped: null as ShippedOrder | null })),
        ...shipped.map(entry => ({ order: entry.order, shipped: entry })),
    ].sort((a, b) => a.order.createdAt.localeCompare(b.order.createdAt));

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">
                        {orders.length === 0 ? 'No orders waiting' : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} waiting to be shipped`}
                    </h2>
                    {orders.length > 0 && <p className="text-gray-600 text-lg">Oldest orders are at the top.</p>}
                </div>
                <div className="flex items-center gap-4">
                    {checkedAt && (
                        <span className="text-gray-500">
                            Last checked at {checkedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                    <Button variant="secondary" onClick={refresh} busy={refreshing} busyLabel="Checking…">
                        ↻ Check for new orders
                    </Button>
                </div>
            </div>

            {error && (
                <Notice tone="warning" title="Couldn't check for new orders just now">
                    {error} The orders below may be out of date.
                </Notice>
            )}

            {cards.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <p className="text-2xl">🎉 You&apos;re all caught up!</p>
                    <p className="mt-2 text-lg text-gray-600">New orders will show up here automatically.</p>
                </div>
            )}

            {cards.map(card => card.shipped ? (
                <ShippedCard key={card.order.id} entry={card.shipped} onDismiss={() => dismissShipped(card.order.id)} />
            ) : (
                <OrderCard key={card.order.id} order={card.order} onShipped={markShipped} />
            ))}
        </div>
    );
}

function OrderCard({ order, onShipped }: { order: OutstandingOrder; onShipped: (entry: ShippedOrder) => void }) {
    const [tracking, setTracking] = useState('');
    const [link, setLink] = useState('');
    const [step, setStep] = useState<'enter' | 'confirm' | 'sending'>('enter');
    const [error, setError] = useState<string | null>(null);
    const { day, ago, daysAgo } = formatOrderDate(order.createdAt);
    const addressLines = formatAddress(order.shipTo, order.address);

    const review = () => {
        const check = checkTrackingLink(tracking);
        if (!check.ok) {
            setError(check.error);
            return;
        }
        setError(null);
        setLink(check.link);
        setStep('confirm');
    };

    const send = async () => {
        setStep('sending');
        const result = await callAdmin(idToken => shipOrder(idToken, order.id, link));
        if (result.ok) {
            onShipped({ order, emailed: result.data.emailed, trackingLink: link });
        } else {
            setError(result.error);
            setStep('enter');
        }
    };

    return (
        <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 px-6 py-4">
                <div>
                    <h3 className="text-2xl font-semibold">{order.shipTo}</h3>
                    <p className={`text-lg ${daysAgo >= 7 ? 'text-amber-700 font-medium' : 'text-gray-600'}`}>
                        Ordered {day} ({ago})
                    </p>
                </div>
                <p className="text-2xl font-semibold">{formatMoney(order.total)}</p>
            </header>

            <div className="grid gap-8 px-6 py-5 lg:grid-cols-3">
                <section>
                    <SectionLabel>Ship to</SectionLabel>
                    <address className="not-italic text-lg leading-relaxed">
                        {addressLines.map((line, index) => <div key={index}>{line}</div>)}
                    </address>
                    <CopyButton text={addressLines.join('\n')} label="Copy address" />

                    <SectionLabel className="mt-5">Customer email</SectionLabel>
                    <p className="text-lg break-all">{order.email}</p>
                </section>

                <section>
                    <SectionLabel>What to send</SectionLabel>
                    <ul className="space-y-3">
                        {order.items.map(item => <ItemRow key={item.pid} item={item} />)}
                    </ul>
                </section>

                <section className="rounded-lg bg-gray-50 p-4">
                    {step === 'enter' ? (
                        <>
                            <label htmlFor={`tracking-${order.id}`} className="block text-lg font-semibold">
                                Tracking link
                            </label>
                            <p className="mb-2 text-gray-600">
                                After you buy the shipping label, copy the tracking link and paste it here.
                            </p>
                            <input
                                id={`tracking-${order.id}`}
                                type="text"
                                inputMode="url"
                                value={tracking}
                                onChange={e => { setTracking(e.target.value); setError(null); }}
                                onKeyDown={e => { if (e.key === 'Enter') review(); }}
                                placeholder="https://tools.usps.com/…"
                                className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-custom-blue/30 ${error ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {error && <p className="mt-2 text-red-700" role="alert">{error}</p>}
                            <Button variant="ship" className="mt-4 w-full" onClick={review}>
                                Mark as shipped…
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-semibold">Ready to send?</p>
                            <p className="mt-1 text-lg text-gray-700">
                                We&apos;ll email <span className="font-medium break-all">{order.email}</span> their tracking link
                                and take this order off your list. This can&apos;t be undone.
                            </p>
                            <p className="mt-2 text-gray-600 break-all">Link: {link}</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <Button variant="ship" onClick={send} busy={step === 'sending'} busyLabel="Sending…">
                                    Yes, email the customer
                                </Button>
                                <Button variant="secondary" onClick={() => setStep('enter')} disabled={step === 'sending'}>
                                    Go back
                                </Button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </article>
    );
}

function ShippedCard({ entry, onDismiss }: { entry: ShippedOrder; onDismiss: () => void }) {
    const { order, emailed, trackingLink } = entry;
    return (
        <article className={`rounded-xl border px-6 py-5 ${emailed ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="text-lg">
                    {emailed ? (
                        <>
                            <p className="text-xl font-semibold text-green-900">✓ {order.shipTo}&apos;s order is marked as shipped</p>
                            <p className="mt-1 text-green-900">We emailed {order.email} their tracking link.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-semibold text-amber-900">{order.shipTo}&apos;s order is marked as shipped, but the email didn&apos;t go through</p>
                            <p className="mt-1 text-amber-900">
                                Please email {order.email} yourself and include the tracking link.
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <CopyButton text={order.email} label="Copy their email" />
                                <CopyButton text={trackingLink} label="Copy tracking link" />
                            </div>
                        </>
                    )}
                </div>
                <Button variant="secondary" onClick={onDismiss}>OK, hide this</Button>
            </div>
        </article>
    );
}

function ItemRow({ item }: { item: OrderItem }) {
    return (
        <li className="flex items-center gap-4">
            {item.image ? (
                <Image src={item.image} alt={item.title ?? ''} width={80} height={80} className="h-20 w-20 flex-none rounded-md object-cover" />
            ) : (
                <div className="h-20 w-20 flex-none rounded-md bg-gray-100" />
            )}
            <div>
                <p className="text-lg font-medium">{item.title ?? 'Painting details missing'}</p>
                {item.size && <p className="text-gray-600">{item.size}</p>}
                {item.prints === 0 ? (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-3 py-0.5 font-medium text-amber-900">Original painting</span>
                ) : (
                    <span className="mt-1 inline-block rounded-full bg-custom-bg-blue px-3 py-0.5 font-medium text-custom-blue">
                        {item.prints} {item.prints === 1 ? 'print' : 'prints'}
                    </span>
                )}
            </div>
        </li>
    );
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <p className={`mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500 ${className}`}>{children}</p>;
}

function formatAddress(name: string, address: OrderAddress) {
    return [
        name,
        address.line1,
        address.line2,
        `${address.city}, ${address.state} ${address.postal_code}`,
        address.country && address.country !== 'US' ? address.country : null,
    ].filter(Boolean) as string[];
}
