import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req: req });
  const url = req.nextUrl;

  // console.log(process.env.RESEND_API_KEY);
  // dbConnect();

  console.log("token: ", token);

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") )
      
  ) {
    return NextResponse.redirect(new URL("/dashboard-user", req.url));
  }

  if (!token && url.pathname.startsWith("/dashboard-user")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard-user/:path*", "/verify/:path*"],
};
