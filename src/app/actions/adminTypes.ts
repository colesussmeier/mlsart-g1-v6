// Dashboard actions report failures as values: Next strips thrown error messages in
// production builds, so a thrown error would reach the dashboard as a generic one.
export type AdminResult<T> = { ok: true; data: T; error?: undefined } | { ok: false; error: string; data?: undefined };

export type OrderItem = {
    pid: string;
    title: string | null;
    image: string | null;
    size: string | null;
    // 0 means the original painting was bought, anything else is a count of prints.
    prints: number;
};

export type OrderAddress = {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country?: string | null;
};

export type OutstandingOrder = {
    id: string;
    email: string;
    shipTo: string;
    address: OrderAddress;
    total: number;
    createdAt: string;
    items: OrderItem[];
};
