import Link from "next/link";
import Image from "next/image";
import { GithubIcon } from "lucide-react";
import { Button } from "./ui/button";

export function NavBar() {
  return (
    <header className="w-full border-b border-b-[#dfe4ec] bg-[#fdfdfb] px-4 py-2 sm:px-8 sm:py-3 lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Link href="/">
        <Button variant="ghost" className="h-auto px-0 hover:bg-transparent">
          <div className="flex items-center gap-3 font-serif text-xl font-semibold text-[#111318] md:text-2xl">
            <Image
              src={"/castle.svg"}
              alt="logo"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="sm:block hidden">Memory Palace</span>
          </div>
        </Button>
      </Link>
      <nav className="hidden items-center gap-11 text-sm font-medium text-[#111318] md:flex">
        <Link href="/palaces">Palaces</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#about">About</Link>
        <span className="h-8 w-px bg-[#cbd3df]" aria-hidden="true" />
        <a
          href="https://github.com/SofiaBargues/memory-palace"
          aria-label="Memory Palace on GitHub"
        >
          <GithubIcon className="size-5" />
        </a>
      </nav>
      <a
        href="https://github.com/SofiaBargues/memory-palace"
        className="md:hidden"
        aria-label="Memory Palace on GitHub"
      >
        <GithubIcon className="size-5" />
      </a>
      </div>
    </header>
  );
}
