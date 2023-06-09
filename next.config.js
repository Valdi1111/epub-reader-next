/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        EPUB_FOLDER: "//192.168.1.170/Elements 1/Novel",
        COVER_FOLDER: "//192.168.1.170/Elements 1/epub-server/covers",
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/library/all',
                permanent: true,
            },
        ]
    }
}

module.exports = nextConfig
