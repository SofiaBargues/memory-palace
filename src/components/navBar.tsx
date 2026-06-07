import Link from "next/link";
import { GithubIcon, Menu } from "lucide-react";
import { CastleLogo } from "./castle-logo";
import { Button } from "./ui/button";

export function NavBar() {
  return (
    <header className="w-full border-b border-b-[#dfe4ec] bg-[#fdfdfb] p-2 sm:p-4 lg:p-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="h-auto px-0 hover:bg-transparent">
            <div className="flex items-center gap-4 text-lg  md:gap-3 md:text-2xl">
              <CastleLogo className="!size-4 object-contain md:!size-5" />
              <span>Memory Palace</span>
            </div>
          </Button>
        </Link>
        <nav className="hidden items-center gap-11 text-sm font-medium text-[#111318] md:flex">
          <Link href="/palaces">Palaces</Link>
          <Link href="/how-it-works">How it works</Link>
          <span className="h-8 w-px bg-[#cbd3df]" aria-hidden="true" />
          <a
            href="https://github.com/SofiaBargues/memory-palace"
            aria-label="Memory Palace on GitHub"
          >
            <GithubIcon className="size-5" />
          </a>
        </nav>
        <button
          type="button"
          className="flex size-11 items-center justify-center text-[#111318] md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
