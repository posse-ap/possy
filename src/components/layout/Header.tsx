import Link from "next/link";
import { Suspense } from "react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container flex h-16 items-center px-4 mx-auto max-w-7xl">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo / Title */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Possy</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Suspense
              fallback={
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded" />
              }
            >
              {/* <AuthButton /> */}
            </Suspense>
          </nav>
        </div>
      </div>
    </header>
  );
};
