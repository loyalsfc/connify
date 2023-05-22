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
}

module.exports = nextConfig
