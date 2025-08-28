import { NextResponse } from "next/server";

const STATIC_FILE_EXTENSIONS = /\.(jpg|jpeg|gif|png|css|js|woff|woff2|ico|json|svg|eot|ttf|otf|map|txt|html)$/i;
const SUPPORTED_LOCALES = ["kz", "ru"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    STATIC_FILE_EXTENSIONS.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/kz/home", req.url), 301);
  }

  if (pathname === "/ru") {
    return NextResponse.redirect(new URL("/ru/home", req.url), 301);
  }

  const firstSegment = pathname.split("/")[1];

if (!SUPPORTED_LOCALES.includes(firstSegment) && firstSegment !== "") {
  const restPath = pathname.split("/").slice(2).join("/");
  const newPathname = `/kz/${restPath}`;
  return NextResponse.redirect(new URL(newPathname, req.url), 301);
}

  return NextResponse.next();
}
