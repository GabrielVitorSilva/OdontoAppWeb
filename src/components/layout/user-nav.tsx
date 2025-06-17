
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Updated getInitials function to be more robust
const getInitials = (name?: string): string => {
  if (typeof name !== 'string' || !name.trim()) {
    return '??'; // Fallback for undefined, null, empty, or whitespace-only names
  }
  const names = name.trim().split(/\s+/); // Split by one or more whitespace characters
  if (names.length > 1 && names[0] && names[names.length - 1]) {
    const firstInitial = names[0][0];
    const lastInitial = names[names.length - 1][0];
    if (firstInitial && lastInitial) { // Check if characters exist
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
  }
  // Handle single name or fallback for names without enough parts
  if (names.length === 1 && names[0] && names[0].length > 0) {
    return names[0].substring(0, Math.min(2, names[0].length)).toUpperCase();
  }
  return '??'; // Final fallback
};


export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user) {
    return null; 
  }

  const displayName = user.name || 'Usuário'; // Fallback for display
  const initials = getInitials(user.name); // Use the robust function

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${initials}`} alt={displayName} data-ai-hint="user avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-headline">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

