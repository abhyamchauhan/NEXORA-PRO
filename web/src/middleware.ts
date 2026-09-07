import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge middleware built from the edge-safe config. The `authorized` callback in
// auth.config.ts enforces access for every matched path BEFORE the page or API
// handler runs — this is the server-side gate, not a UI convenience.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};
