export function Button({
  className,
  type,
  onClick,
  children,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={"border bg-green-400 rounded-lg w-48 p-4 my-9 " + className}
    >
      {children}
    </button>
  );
}