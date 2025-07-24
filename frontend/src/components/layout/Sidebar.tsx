import { AppShell, NavLink, Group, Image } from '@mantine/core';
import {
  IconHome2,
  IconShoppingCart,
  IconUsers,
  IconBox,
  IconReportMoney,
  IconSettings,
  IconTruckDelivery, // Adicionar ícone para fornecedores
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const navLinks = [
  { icon: IconHome2, label: 'Dashboard', to: '/' },
  { icon: IconShoppingCart, label: 'Pedidos', to: '/orders' },
  { icon: IconUsers, label: 'Clientes', to: '/customers' },
  { icon: IconTruckDelivery, label: 'Fornecedores', to: '/suppliers' },
  { icon: IconBox, label: 'Estoque', to: '/stock' },
  { icon: IconReportMoney, label: 'Financeiro', to: '/financial' },
  { icon: IconSettings, label: 'Configurações', to: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  const links = navLinks.map((link) => (
    <NavLink
      key={link.label}
      component={Link}
      to={link.to}
      label={link.label}
      leftSection={<link.icon size="1rem" stroke={1.5} />}
      active={location.pathname === link.to}
    />
  ));

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section>
        <Group justify="center" mb="xl">
          <Image src={logo} alt="Miga Personalizados" maw={100} />
        </Group>
      </AppShell.Section>
      <AppShell.Section grow>
        {links}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
