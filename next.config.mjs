/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    basePath: '/mbr',
    assetPrefix: '/mbr',
    images: { path: '/mbr/_next/image', unoptimized: true },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/mbr',
                basePath: false,
                permanent: false
            }
        ]
    }
};

export default nextConfig;
