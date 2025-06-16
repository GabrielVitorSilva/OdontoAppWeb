import { Smile } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export function Logo({ className, iconSize = 24, textSize = 'text-xl', showText = true }: LogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <Smile size={iconSize} className="text-primary" />
      {showText && <span className={`font-headline font-bold ${textSize} text-primary`}>OdontoApp</span>}
    </Link>
  );
}
