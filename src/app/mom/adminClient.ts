import { fetchAuthSession } from 'aws-amplify/auth';
import type { AdminResult } from '../actions/adminTypes';

export async function callAdmin<T>(action: (idToken: string) => Promise<AdminResult<T>>): Promise<AdminResult<T>> {
    try {
        const session = await fetchAuthSession();
        return await action(session.tokens?.idToken?.toString() ?? '');
    } catch (err) {
        console.error(err);
        return { ok: false, error: "Couldn't reach the shop. Check that you're connected to the internet, then try again." };
    }
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(amount: number) {
    return money.format(amount);
}

export function formatOrderDate(iso: string) {
    const date = new Date(iso);
    const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfThatDay = new Date(date);
    startOfThatDay.setHours(0, 0, 0, 0);
    const daysAgo = Math.round((startOfToday.getTime() - startOfThatDay.getTime()) / 86_400_000);
    const ago = daysAgo <= 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
    return { day, ago, daysAgo };
}
