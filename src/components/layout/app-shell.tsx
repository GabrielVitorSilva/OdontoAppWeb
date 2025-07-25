'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/ui/logo';
import { SidebarNav } from './sidebar-nav';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

function AppShellHeader() {
  const { isMobile, toggleSidebar, state, open } = useSidebar();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {isMobile || state === 'collapsed' ? (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden group-data-[collapsible=icon]:hidden">
            {open ? <PanelLeftOpen /> : <PanelRightOpen />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        ) : null}
         {!isMobile && state === 'expanded' && <Logo className="mr-4 hidden md:flex" showText={true} href="/dashboard" />}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserNav />
        </div>
      </div>
    </header>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  // Determine defaultOpen based on localStorage or a default, handled by SidebarProvider
  const storedSidebarState = typeof window !== 'undefined' ? localStorage.getItem('sidebar_state') : null;
  const defaultOpen = storedSidebarState ? JSON.parse(storedSidebarState) : true;


  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={(open) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_state', JSON.stringify(open));
      }
    }}>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="bg-[#25324B] border-none rounded-none min-h-screen">
        <SidebarHeader className="p-4 bg-[#25324B]">
           <Logo showText={true} href="/dashboard" textColor="text-white" />
        </SidebarHeader>
        <SidebarContent className="bg-[#25324B]">
          <SidebarNav />
        </SidebarContent>
        {/* <SidebarFooter className="p-2 bg-[#25324B]">
          <UserNav />
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <AppShellHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
