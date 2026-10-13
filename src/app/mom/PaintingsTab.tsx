"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Painting } from '../actions/adminTypes';
import { listPaintings, setPaintingSold } from '../actions/paintings';
import { callAdmin } from './adminClient';
import { Button, Notice, Spinner } from './ui';

type Filter = 'all' | 'available' | 'sold';

export default function PaintingsTab({ active }: { active: boolean }) {
    const [paintings, setPaintings] = useState<Painting[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const latestRequest = useRef(0);

    const load = useCallback(async () => {
        const request = ++latestRequest.current;
        setLoading(true);
        const result = await callAdmin(listPaintings);
        if (request !== latestRequest.current) return;

        setLoading(false);
        if (result.ok) {
            setPaintings(result.data);
            setError(null);
        } else {
            setError(result.error);
        }
    }, []);

    // Reloaded on every visit so paintings added in the other tab show up here.
    useEffect(() => {
        if (active) load();
    }, [active, load]);

    const updated = useCallback((pid: string, sold: boolean) => {
        setPaintings(current => current?.map(painting => painting.pid === pid ? { ...painting, sold } : painting) ?? current);
    }, []);

    if (paintings === null) {
        return error ? (
            <div className="space-y-4">
                <Notice tone="error" title="The paintings didn't load">{error}</Notice>
                <Button onClick={load} busy={loading} busyLabel="Trying again…">Try again</Button>
            </div>
        ) : (
            <div className="flex items-center gap-3 py-16 justify-center text-xl text-gray-600">
                <Spinner className="h-7 w-7" /> Loading your paintings…
            </div>
        );
    }

    const query = search.trim().toLowerCase();
    const shown = paintings.filter(painting =>
        (filter === 'all' || (filter === 'sold') === painting.sold) &&
        (!query || painting.title.toLowerCase().includes(query))
    );
    const soldCount = paintings.filter(painting => painting.sold).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">Your paintings</h2>
                <p className="text-lg text-gray-600">
                    If you sell an original in person, mark it as sold here and it will be taken out of the shop.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title"
                    aria-label="Search paintings by title"
                    className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-custom-blue/30"
                />
                <div role="group" aria-label="Show" className="flex gap-2">
                    <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All ({paintings.length})</FilterButton>
                    <FilterButton active={filter === 'available'} onClick={() => setFilter('available')}>For sale ({paintings.length - soldCount})</FilterButton>
                    <FilterButton active={filter === 'sold'} onClick={() => setFilter('sold')}>Sold ({soldCount})</FilterButton>
                </div>
            </div>

            {error && (
                <Notice tone="warning" title="Couldn't refresh the paintings just now">
                    {error} The list below may be out of date.
                </Notice>
            )}

            {shown.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-xl text-gray-600">
                    No paintings match.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map(painting => <PaintingCard key={painting.pid} painting={painting} onUpdated={updated} />)}
                </div>
            )}
        </div>
    );
}

function PaintingCard({ painting, onUpdated }: { painting: Painting; onUpdated: (pid: string, sold: boolean) => void }) {
    const [step, setStep] = useState<'idle' | 'confirm' | 'saving'>('idle');
    const [error, setError] = useState<string | null>(null);
    const markingSold = !painting.sold;

    const save = async () => {
        setStep('saving');
        setError(null);
        const result = await callAdmin(idToken => setPaintingSold(idToken, painting.pid, markingSold));
        setStep('idle');
        if (result.ok) {
            onUpdated(painting.pid, result.data.sold);
        } else {
            setError(result.error);
        }
    };

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                    src={painting.image}
                    alt={painting.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover ${painting.sold ? 'opacity-50' : ''}`}
                />
                {painting.sold && (
                    <span className="absolute left-3 top-3 rounded-full bg-gray-900 px-3 py-1 text-base font-semibold text-white">Sold</span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                    <h3 className="text-xl font-semibold">{painting.title}</h3>
                    <p className="text-gray-600">{[painting.size, painting.collection].filter(Boolean).join(' · ')}</p>
                </div>

                {error && <p className="text-red-700" role="alert">{error}</p>}

                <div className="mt-auto">
                    {step === 'idle' ? (
                        <Button variant={markingSold ? 'primary' : 'secondary'} className="w-full" onClick={() => setStep('confirm')}>
                            {markingSold ? 'Mark as sold…' : 'Put back in the shop…'}
                        </Button>
                    ) : (
                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-lg">
                                {markingSold
                                    ? 'This takes the painting and its prints out of the shop.'
                                    : 'Customers will be able to buy this painting again.'}
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                                <Button onClick={save} busy={step === 'saving'} busyLabel="Saving…">
                                    {markingSold ? 'Yes, mark as sold' : 'Yes, put it back'}
                                </Button>
                                <Button variant="secondary" onClick={() => setStep('idle')} disabled={step === 'saving'}>
                                    Go back
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`rounded-lg border-2 px-4 py-2 text-lg font-medium transition-colors ${
                active ? 'border-custom-blue bg-custom-bg-blue text-custom-blue' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
        >
            {children}
        </button>
    );
}
