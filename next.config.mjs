/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'image-bucketa5861-dev.s3.us-east-1.amazonaws.com',
            port: '',
            pathname: '**',
        }],
    },
};

export default nextConfig;