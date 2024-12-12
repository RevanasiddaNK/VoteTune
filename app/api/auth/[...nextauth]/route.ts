import { prismaClient } from "@/app/lib/db"; // Corrected import path
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params) {
      if (!params.user?.email) {
        console.log("No email found for the user.");
        return false; // Reject sign-in if no email exists
      }

      try {
        // Check if the user already exists
        const existingUser = await prismaClient.user.findUnique({
          where: { email: params.user.email },
        });

        // If the user does not exist, create them
        if (!existingUser) {
          await prismaClient.user.create({
            data: {
              email: params.user.email,
              provider: "Google",
            },
          });
          console.log("User created:", params.user.email);
        } else {
          console.log("User already exists:", params.user.email);
        }
      } catch (error) {
        console.error("Error during sign-in process:", error);
        return false; // Optionally reject sign-in if there’s an error
      }

      return true; // Allow sign-in
    },
  },
});

export { handler as GET, handler as POST };
