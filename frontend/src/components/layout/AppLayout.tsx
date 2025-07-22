import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
    >
        <Header />
        <Sidebar />

        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
  );
}
