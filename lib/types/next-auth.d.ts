import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
    user: {
      id?: string;
      image?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    image?: string;
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
    };
  }
}
