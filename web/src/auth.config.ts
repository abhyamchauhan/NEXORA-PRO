import type { NextAuthConfig } from "next-auth";

// Edge-safe config: NO Prisma, NO bcrypt here (they can't run in middleware's
// edge runtime). This half is imported by middleware.ts; the full config in
// auth.ts spreads it and adds the Credentials/Google providers + adapter.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    // Runs in middleware for every matched request. This is the server-side
    // gate for /admin (page + API), /account, /orders and /checkout.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      // Admin API: return a real 403 rather than a redirect.
      if (path.startsWith("/api/admin")) {
        if (isLoggedIn && role === "admin") return true;
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      // Admin pages: admins only. Logged-in non-admins are bounced home;
      // anonymous users go to /login (handled by returning false).
      if (path.startsWith("/admin")) {
        if (isLoggedIn && role === "admin") return true;
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return false;
      }

      // Customer-only areas: any authenticated user.
      if (
        path.startsWith("/account") ||
        path.startsWith("/orders") ||
        path.startsWith("/checkout")
      ) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        // `role` is present on the object returned by authorize() and on the
        // adapter user (Google sign-in). Default to customer defensively.
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "customer" | "admin") ?? "customer";
      }
      return session;
    },
  },
  providers: [], // real providers are added in auth.ts
} satisfies NextAuthConfig;
