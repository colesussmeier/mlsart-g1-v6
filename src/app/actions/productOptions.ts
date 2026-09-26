export const COLLECTIONS = ["Landscape", "Floral"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export const STRIPE_PRICE_IDS: Record<number, string> = {
    135: 'price_1POSZQJyYHbUmOah622LeniZ',
    165: 'price_1PEHeHJyYHbUmOahKZihfmm0',
    185: 'price_1PEHdpJyYHbUmOahmDlbyBBC',
    250: 'price_1PWLKUJyYHbUmOahH6SxYVoZ',
};

export const PRICES = Object.keys(STRIPE_PRICE_IDS).map(Number).sort((a, b) => a - b);
