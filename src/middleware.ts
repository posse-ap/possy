// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 例：/app 配下を全部ログイン必須にする
  const isProtected = pathname.startsWith("/app")

  if (isProtected && !user) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/app/:path*"],
}
