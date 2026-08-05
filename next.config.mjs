/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    basePath: '/',
    assetPrefix: '/',
    images: { path: '/_next/image', unoptimized: true },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/',
                basePath: false,
                permanent: false
            }
        ]
    }
};

export default nextConfig;
