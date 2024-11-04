import Link from "next/link";

export function NavBar() {
  return (
    <header className="w-full flex justify-between items-center bg-withe sm:px-89 px-4 py-4 border-b border-b-[#e6ebf4] ">
      <Link href="/">
        <div className="flex items-center gap-2 text-lg font-medium">
          <img src={"/castle.svg"} alt="logo" className="w-6 object-contain " />
          Memory Place
        </div>
      </Link>
      <Link
        href="/palace"
        className="font-inter  bg-black text-wite px-4 py-2 text-white rounded-md"
      >
        Create
      </Link>
    </header>
  );
}
