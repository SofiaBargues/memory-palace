export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"border-2 w-52 p-1 m-1 bg-white rounded-lg h-8 " + className}
    >
      {children}
    </div>
  );
}
