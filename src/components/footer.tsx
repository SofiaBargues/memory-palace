import { GitHubRepo } from "./Github";
import { LinkedIn } from "./LinkedIn";

export function Footer() {
  return (
    <footer className="bg-white py-2 w-full">
      {/* w-full flex justify-between items-center bg-withe sm:px-89 px-4 py-4 border-b border-b-[#e6ebf4]  */}
      <div className="flex justify-row justify-center items-center  container mx-auto  py-4 px-4 border-t border-t-[#e6ebf4]  ">
        <p className="text-sm flex text- text-center gap-2">
          Sofia Bargues
          <LinkedIn />
          <GitHubRepo />
        </p>
      </div>
    </footer>
  );
}
