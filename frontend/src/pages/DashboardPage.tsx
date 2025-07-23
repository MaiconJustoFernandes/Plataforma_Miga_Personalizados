import { Container, Title, Text, Paper, SimpleGrid, Group, ThemeIcon } from '@mantine/core';
import { IconUsers, IconShoppingCart, IconBox, IconReportMoney } from '@tabler/icons-react';

const mockStats = [
  {
    title: 'Pedidos Ativos',
    value: '12',
    icon: IconShoppingCart,
    color: 'blue',
  },
  {
    title: 'Clientes Cadastrados',
    value: '48',
    icon: IconUsers,
    color: 'green',
  },
  {
    title: 'Produtos em Estoque',
    value: '156',
    icon: IconBox,
    color: 'yellow',
  },
  {
    title: 'Faturamento do Mês',
    value: 'R$ 8.450',
    icon: IconReportMoney,
    color: 'violet',
  },
];

export function DashboardPage() {
  const stats = mockStats.map((stat) => (
    <Paper withBorder p="md" radius="md" key={stat.title}>
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {stat.title}
          </Text>
          <Text fw={700} fz="xl">
            {stat.value}
          </Text>
        </div>
        <ThemeIcon color={stat.color} variant="light" size="xl" radius="md">
          <stat.icon size="1.8rem" stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  ));

  return (
    <Container size="lg">
      <Title order={1} mb="xl">
        Dashboard
      </Title>
      
      <Text size="lg" c="dimmed" mb="xl">
        Bem-vindo à Plataforma Miga Personalizados! Aqui você pode acompanhar as principais métricas do seu negócio.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats}
      </SimpleGrid>

      <Paper withBorder p="md" radius="md" mt="xl">
        <Title order={3} mb="md">
          Próximos Passos
        </Title>
        <Text>
          🚀 O sistema de autenticação está funcionando perfeitamente!<br />
          📊 Este dashboard será expandido nas próximas fases com dados reais<br />
          🎯 Os módulos de Pedidos, Clientes, Estoque e Financeiro serão implementados em breve
        </Text>
      </Paper>
    </Container>
  );
}
