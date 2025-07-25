import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
  href?: string;
  textColor?: string; // nova prop para cor do texto
}

export function Logo({
  className,
  iconSize = 24,
  textSize = 'text-xl',
  showText = true,
  href = "/",
  textColor = 'text-primary', // azul padrão
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 group ${className}`}>
      <Image
        src="/logo.png"
        alt="Logo OdontoApp"
        width={iconSize}
        height={iconSize}
        className="text-primary"
      />
      {showText && (
        <span
          className={`font-headline font-bold ${textSize} ${textColor} hidden sm:block transition-colors duration-200 group-hover:brightness-110 group-hover:underline group-hover:decoration-2 group-hover:decoration-blue-400`}
        >
          OdontoApp
        </span>
      )}
    </Link>
  );
}