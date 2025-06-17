
'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Users,
  Settings, // Kept for future example, can be removed if not needed
  UserCog, // Corrected: Icon for user management
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Profile } from '@/types';

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/dashboard/treatments', label: 'Tratamentos', icon: ClipboardList, adminOnly: false },
  { href: '/dashboard/appointments', label: 'Consultas', icon: CalendarDays, adminOnly: false },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users, adminOnly: false },
];

const adminNavItems = [
    { href: '/dashboard/users', label: 'Usuários', icon: UserCog, adminOnly: true }, // Corrected: UserCog
];

// Example for future:
// { href: '/dashboard/settings', label: 'Configurações', icon: Settings, adminOnly: true },


export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    ...baseNavItems,
    ...(user?.user.User.role === Profile.ADMIN ? adminNavItems : [])
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, side: 'right' }}
              aria-label={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
