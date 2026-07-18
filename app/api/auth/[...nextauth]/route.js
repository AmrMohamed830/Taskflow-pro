import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.image = user.image;

                // Sync with the backend database
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: user.name,
                            email: user.email,
                            avatar: user.image,
                        }),
                    });

                    const data = await response.json();
                    if (data.success && data.token) {
                        token.backendToken = data.token;
                        token.backendUser = data.user;
                    }
                } catch (error) {
                    console.error("Error in NextAuth social login callback:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.image = token.image;
                session.backendToken = token.backendToken;
                session.backendUser = token.backendUser;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
