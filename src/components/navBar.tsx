import Link from "next/link";
import { RainbowButton } from "./rainbow-button";
import { GithubIcon } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export function NavBar() {
  return (
    <header className="w-full flex justify-between items-center bg-withe sm:px-89 px-4 py-4 border-b border-b-[#e6ebf4] ">
      <Link href="/">
        <Button variant={"secondary"}>
          <div className="flex items-center gap-2 text-md md:text-lg lg:text-xl font-medium">
            <img
              src={"/castle.svg"}
              alt="logo"
              className="w-6 object-contain "
            />
            Memory Palace
          </div>
        </Button>
      </Link>
      <a href="https://github.com/SofiaBargues/memory-palace">
        <RainbowButton className="gap-2">
          <GithubIcon className="size-5" />
          <p className="hidden sm:block">Star on Github</p>
          <StarFilledIcon className="hidden sm:block group-hover:text-yellow-400" />
        </RainbowButton>
      </a>
    </header>
  );
}
