import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
  href?: string;
}

export function Logo({
  className,
  iconSize = 24,
  textSize = 'text-xl',
  showText = true,
  href = "/",
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Logo OdontoApp"
        width={iconSize}
        height={iconSize}
        className="text-primary"
      />
      {showText && (
        <span className={`font-headline font-bold ${textSize} text-primary hidden sm:block`}>
          OdontoApp
        </span>
      )}
    </Link>
  );
}