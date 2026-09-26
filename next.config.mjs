/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '**',
        }],
        minimumCacheTTL: 60,
    },
    experimental: {
        serverActions: {
            // Painting photos are sent through a server action, and the 1 MB default
            // rejects most photos straight off a phone or camera.
            bodySizeLimit: '8mb',
        },
    },
};

export default nextConfig;
