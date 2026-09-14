import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { ensureDbUser } from "@/lib/db/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      id: "demo-student",
      name: "Demo Student",
      credentials: {},
      async authorize() {
        return {
          id: "demo-student-01",
          name: "Siswa Perintis (Demo)",
          email: "student@tami.dev",
          image: "/mascot/tami-headshot.webp",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (token.email) {
        const canonicalId = await ensureDbUser({
          id: (token.id as string) || (token.sub as string),
          name: (token.name as string) || (user?.name as string),
          email: token.email as string,
          image: (token.picture as string) || (user?.image as string),
        });
        if (canonicalId) {
          token.id = canonicalId;
          token.sub = canonicalId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);

        // Guarantee canonical user ID matching Neon DB users table
        if (session.user.email) {
          const canonicalId = await ensureDbUser({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          });
          if (canonicalId) {
            session.user.id = canonicalId;
          }
        }
      }
      return session;
    },
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "tami_super_secret_jwt_key_2026_bali_fest",
});
