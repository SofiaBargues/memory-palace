import { GitHubRepo } from "./Github";
import { LinkedIn } from "./LinkedIn";

export function Footer() {
  return (
    <footer className="bg-white py-2 w-full   px-4 border-t border-t-[#e6ebf4]">
      <div className="flex justify-row justify-center items-center  container mx-auto  ">
        <div className="text-sm flex text- text-center gap-2">
         <p>Sofia Bargues</p>
          <LinkedIn />
          <GitHubRepo />
        </div>
      </div>
    </footer>
  );
}
