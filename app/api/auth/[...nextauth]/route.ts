import { prismaClient } from "app/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: "536284881611-q9l4u2slnkp848gl4qbp7a61thfhubtk.apps.googleusercontent.com",
          clientSecret: "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",
        }),
    ],

    callbacks : {
      async signIn(params) {
        if(!params.user.email){
          return false;
        }
        
        try {
          await prismaClient.user.create({
            data : {
              email: params.user.email || "",
              provider: "Google"
            }
          });

        } catch (error) {
          
        }
          
        return true
      },
    }
})

export { handler as GET, handler as POST }