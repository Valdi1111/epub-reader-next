export { default } from "next-auth/middleware"


export const config = {
    matcher: [
        '/library/:path*',
        '/books/:path*',
    ]
}
