"use client";

import { useEffect, useState } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'ship' | 'secondary' | 'quiet';
    busy?: boolean;
    busyLabel?: string;
};

const VARIANTS = {
    primary: 'bg-custom-blue text-white hover:bg-[#0b6a80] disabled:bg-custom-blue/60',
    ship: 'bg-green-700 text-white hover:bg-green-800 disabled:bg-green-700/60',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 disabled:text-gray-400',
    quiet: 'bg-transparent text-custom-blue hover:bg-custom-bg-blue disabled:text-gray-400',
};

export function Button({ variant = 'primary', busy = false, busyLabel, className = '', children, disabled, ...rest }: ButtonProps) {
    return (
        <button
            type="button"
            {...rest}
            disabled={disabled || busy}
            aria-busy={busy}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-lg font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-custom-blue/30 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
        >
            {busy && <Spinner />}
            {busy && busyLabel ? busyLabel : children}
        </button>
    );
}

export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

const NOTICE_STYLES = {
    success: 'bg-green-50 border-green-300 text-green-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    info: 'bg-custom-bg-blue border-custom-blue/30 text-gray-900',
};

export function Notice({ tone, title, children }: { tone: keyof typeof NOTICE_STYLES; title?: string; children?: React.ReactNode }) {
    return (
        <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-5 py-4 text-lg ${NOTICE_STYLES[tone]}`}>
            {title && <p className="font-semibold">{title}</p>}
            {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
        </div>
    );
}

export function CopyButton({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    return (
        <Button
            variant="quiet"
            className="!px-3 !py-1.5 !text-base"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                } catch {
                    window.prompt('Copy this:', text);
                }
            }}
        >
            {copied ? '✓ Copied' : label}
        </Button>
    );
}
