import { NEXT_AUTH_CONFIG } from "@/app/lib/auth" 
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      userType: string; // Custom userType field
    };
  }

  interface User {
    id: string;
    userType: string; // Custom userType field
  }
}
const handler = NextAuth(NEXT_AUTH_CONFIG)

export { handler as GET, handler as POST }