import { GitHubRepo } from "./Github";
import { LinkedIn } from "./LinkedIn";

export function Footer() {
  return (
    <footer className="flex h-10 min-h-10 max-h-10 shrink-0 items-center overflow-hidden border-t border-t-black/10 bg-white px-4">
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
