import { GitHubRepo } from "./Github";
import { LinkedIn } from "./LinkedIn";

export function Footer() {
  return (
    <footer className="flex h-9 shrink-0 items-center border-t border-t-[#e6ebf4] bg-white px-4">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 text-center text-sm leading-none">
          <p>Sofia Bargues</p>
          <LinkedIn />
          <GitHubRepo />
        </div>
      </div>
    </footer>
  );
}
