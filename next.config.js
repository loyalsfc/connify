/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          // Proxy API requests to the Node.js server
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's2.coinmarketcap.com',
                port: '',
                pathname: "/static/**",
            }
        ]
    }
}

module.exports = nextConfig
