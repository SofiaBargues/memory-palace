import Link from "next/link";

export function NavBar() {
  return (
    <header className="w-full flex justify-between items-center bg-withe sm:px-89 px-4 py-4 border-b border-b-[#e6ebf4] ">
      <Link href="/">
        <img src={"/logo.svg"} alt="logo" className="w-28 object-contain " />
      </Link>
      <Link
        href="/create-post"
        className="font-inter font-medium bg-[#6469ff] text-wite px-4 py-2 text-white rounded-md"
      >
        Create
      </Link>
    </header>
  );
}
