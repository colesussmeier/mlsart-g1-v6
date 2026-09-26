"use client";

import { withAuthenticator, type WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import config from '../../amplifyconfiguration.json';
import OrdersTab from './OrdersTab';
import AddPaintingTab from './AddPaintingTab';
import { useOrders } from './useOrders';
import { Button } from './ui';

Amplify.configure(config);

type Tab = 'orders' | 'add';

function Mom({ signOut, user }: WithAuthenticatorProps) {
    const [tab, setTab] = useState<Tab>('orders');
    const orders = useOrders();
    const waiting = orders.orders?.length;

    return (
        <main className="min-h-screen bg-stone-50 font-sans text-gray-900">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-semibold">Shop dashboard</h1>
                        {user?.signInDetails?.loginId && (
                            <p className="mt-1 text-lg text-gray-600">Signed in as {user.signInDetails.loginId}</p>
                        )}
                    </div>
                    <Button variant="secondary" onClick={signOut}>Sign out</Button>
                </header>

                <div role="tablist" aria-label="Dashboard sections" className="mb-8 flex gap-3 border-b border-gray-200">
                    <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>
                        Orders to ship
                        {waiting ? (
                            <span className="ml-2 rounded-full bg-green-700 px-2.5 py-0.5 text-base text-white">{waiting}</span>
                        ) : null}
                    </TabButton>
                    <TabButton active={tab === 'add'} onClick={() => setTab('add')}>
                        Add a painting
                    </TabButton>
                </div>

                {/* Both stay mounted so switching tabs never loses a half-filled form or tracking link. */}
                <section role="tabpanel" hidden={tab !== 'orders'}>
                    <OrdersTab state={orders} />
                </section>
                <section role="tabpanel" hidden={tab !== 'add'}>
                    <AddPaintingTab />
                </section>
            </div>
        </main>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={`-mb-px flex items-center border-b-4 px-4 pb-3 pt-2 text-xl font-medium transition-colors ${
                active ? 'border-custom-blue text-custom-blue' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
        >
            {children}
        </button>
    );
}

export default withAuthenticator(Mom, { hideSignUp: true });
