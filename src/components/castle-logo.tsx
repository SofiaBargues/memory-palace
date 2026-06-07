import Image from "next/image";

type CastleLogoProps = {
  className?: string;
  size?: number;
};

export function CastleLogo({ className, size = 48 }: CastleLogoProps) {
  return (
    <Image
      src="/castle.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
