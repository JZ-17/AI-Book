// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Use the Google ID directly as text
        const { data: existingUser, error: selectError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          console.error("Error checking user:", selectError);
          throw selectError;
        }

        if (!existingUser) {
          // Create new user with Google ID
          const { error: insertError } = await supabaseAdmin
            .from("users")
            .insert([
              {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar_url: user.image,
              },
            ]);
          
          if (insertError) {
            console.error("Error creating user:", insertError);
            throw insertError;
          }
        }

        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return true; // Allow sign in even if DB operations fail
      }
    },
    async session({ session, token }) {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };