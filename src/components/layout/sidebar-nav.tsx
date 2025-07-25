
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
  // { href: '/dashboard/clients', label: 'Clientes', icon: Users, adminOnly: false },
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
    <SidebarMenu className="py-6 px-2 bg-[#25324B] min-h-[80vh] flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.href} className="mb-1">
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={{ children: item.label, side: 'right' }}
                aria-label={item.label}
                className={
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 ` +
                  (isActive
                    ? 'bg-blue-500/90 text-white shadow scale-[1.04]'
                    : 'text-blue-100 hover:bg-blue-500/40 hover:text-white')
                }
                style={{ boxShadow: isActive ? '0 2px 8px 0 rgba(59,130,246,0.10)' : undefined }}
              >
                <item.icon className={
                  `w-6 h-6 transition-colors duration-200 ` +
                  (isActive ? 'text-white' : 'text-blue-200 group-hover:text-white')
                } />
                <span className="truncate">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
