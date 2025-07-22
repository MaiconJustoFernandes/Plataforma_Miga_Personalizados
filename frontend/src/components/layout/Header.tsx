import { AppShell, Group, ActionIcon, Menu, Text, Avatar } from '@mantine/core';
import { IconBell, IconSettings, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <AppShell.Header>
      <Group justify="flex-end" h="100%" px="md">
        <ActionIcon variant="default" size="lg">
          <IconBell size={20} />
        </ActionIcon>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Avatar color="cyan" radius="xl">{user?.name?.charAt(0).toUpperCase()}</Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Conta</Menu.Label>
            <Text size="sm" fw={500} mx="sm">{user?.name}</Text>
            <Text size="xs" c="dimmed" mx="sm">{user?.email}</Text>
            
            <Menu.Divider />

            <Menu.Item leftSection={<IconSettings size={14} />}>Configurações</Menu.Item>
            <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={logout}>
              Sair
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </AppShell.Header>
  );
}
