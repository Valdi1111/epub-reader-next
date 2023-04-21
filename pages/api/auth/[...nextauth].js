import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/core/prisma";
import NextAuth from "next-auth"
import bcrypt from "bcrypt";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Email', autocomplete: 'email' },
                password: { label: 'Password', type: 'password', autocomplete: 'current-password' }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) {
                    return null;
                }
                const match = await bcrypt.compareSync(credentials.password, user.password);
                if (!match) {
                    return null;
                }
                return { name: user.username, email: user.email, image: user.avatar }
            }
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: '/auth/sign-in',
    }
};

export default NextAuth(authOptions);
