import { GitHubRepo } from "./Github";
import { LinkedIn } from "./LinkedIn";

export function Footer() {
  return (
    <footer className="bg-black py-2 w-full">
      <div className="flex justify-row justify-center items-center  container mx-auto px-4">
        <p className="text-sm flex text-gray-200 text-center gap-2">
          Sofia Bargues
          <LinkedIn />
          <GitHubRepo />
        </p>
      </div>
    </footer>
  );
}
