export type TrackingLinkCheck = { ok: true; link: string; error?: undefined } | { ok: false; error: string; link?: undefined };

export function checkTrackingLink(input: string): TrackingLinkCheck {
    const trimmed = input.trim();
    if (!trimmed) {
        return { ok: false, error: "Paste the tracking link first." };
    }

    const withScheme = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    let url: URL;
    try {
        url = new URL(withScheme);
    } catch {
        url = null;
    }

    if (!url || (url.protocol !== "https:" && url.protocol !== "http:") || !url.hostname.includes(".")) {
        return {
            ok: false,
            error: "That doesn't look like a link. Copy the whole tracking link from the shipping website. It usually starts with https://",
        };
    }

    // The serialized URL percent-encodes quotes and angle brackets, which is what makes
    // it safe to drop into the email's href.
    return { ok: true, link: url.href };
}
