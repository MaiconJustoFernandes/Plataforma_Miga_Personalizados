import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Title,
  Tabs,
  Card,
  Text,
  Grid,
  Button,
  Group,
  Badge,
  Divider,
  Stack,
  ActionIcon,
  LoadingOverlay,
} from '@mantine/core';
import { IconArrowLeft, IconPencil } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../contexts/AuthContext';
import { getCustomer } from '../services/customers.service';
import type { Customer } from '../types/customer';

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('dados');

  const fetchCustomer = async () => {
    if (!id || !user || !token) return;

    try {
      setLoading(true);
      const data = await getCustomer(id, token);
      setCustomer(data);
    } catch (error) {
      notifications.show({
        title: 'Erro ao carregar cliente',
        message: 'Não foi possível carregar os dados do cliente.',
        color: 'red',
      });
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id, user, token]);

  const handleEdit = () => {
    navigate(`/customers?edit=${id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDocument = (doc: string) => {
    if (!doc) return '-';
    if (doc.replace(/\D/g, '').length === 11) {
      // CPF
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  if (loading) {
    return (
      <Box pos="relative" h={400}>
        <LoadingOverlay visible={loading} />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box>
        <Text>Cliente não encontrado.</Text>
        <Button onClick={() => navigate('/customers')} mt="md">
          Voltar para Lista
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Group>
          <ActionIcon variant="light" onClick={() => navigate('/customers')}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={2}>Ficha do Cliente</Title>
        </Group>
        <Button
          leftSection={<IconPencil size={16} />}
          onClick={handleEdit}
        >
          Editar Cliente
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="dados">
            Dados Cadastrais
          </Tabs.Tab>
          <Tabs.Tab value="historico" disabled>
            Histórico de Pedidos
            <Badge size="xs" ml="xs" color="gray">Em breve</Badge>
          </Tabs.Tab>
          <Tabs.Tab value="observacoes" disabled>
            Observações
            <Badge size="xs" ml="xs" color="gray">Em breve</Badge>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="dados" pt="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card withBorder>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={3}>Informações Pessoais</Title>
                  </Group>
                  
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">Nome Completo</Text>
                      <Text>{customer.fullName}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">CPF/CNPJ</Text>
                      <Text>{formatDocument(customer.cpfCnpj)}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">WhatsApp</Text>
                      <Text>{customer.whatsapp || '-'}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">E-mail</Text>
                      <Text>{customer.email || '-'}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">Sexo</Text>
                      <Text>{customer.gender || '-'}</Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Text size="sm" fw={500} c="dimmed">Data de Nascimento</Text>
                      <Text>{formatDate(customer.birthDate)}</Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text size="sm" fw={500} c="dimmed">Como nos conheceu</Text>
                      <Text>{customer.origin || '-'}</Text>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Card withBorder>
                  <Stack gap="md">
                    <Title order={4}>Endereço</Title>
                    <Divider />
                    <Stack gap="xs">
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">CEP:</Text>
                        <Text size="sm">{customer.cep || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Rua:</Text>
                        <Text size="sm">{customer.street || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Número:</Text>
                        <Text size="sm">{customer.number || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Complemento:</Text>
                        <Text size="sm">{customer.complement || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Bairro:</Text>
                        <Text size="sm">{customer.neighborhood || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Cidade:</Text>
                        <Text size="sm">{customer.city || '-'}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Estado:</Text>
                        <Text size="sm">{customer.state || '-'}</Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>

                <Card withBorder>
                  <Stack gap="md">
                    <Title order={4}>Informações do Sistema</Title>
                    <Divider />
                    <Stack gap="xs">
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Cadastrado em:</Text>
                        <Text size="sm">{formatDate(customer.createdAt)}</Text>
                      </Group>
                      <Group>
                        <Text size="sm" fw={500} c="dimmed">Última atualização:</Text>
                        <Text size="sm">{formatDate(customer.updatedAt)}</Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="historico" pt="md">
          <Card withBorder>
            <Stack gap="md" align="center" py="xl">
              <Text size="lg" fw={500} c="dimmed">Histórico de Pedidos</Text>
              <Text size="sm" c="dimmed" ta="center">
                Esta funcionalidade será implementada em fases futuras.<br />
                Aqui será exibido o histórico completo de pedidos do cliente.
              </Text>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="observacoes" pt="md">
          <Card withBorder>
            <Stack gap="md" align="center" py="xl">
              <Text size="lg" fw={500} c="dimmed">Observações</Text>
              <Text size="sm" c="dimmed" ta="center">
                Esta funcionalidade será implementada em fases futuras.<br />
                Aqui será possível adicionar observações personalizadas sobre o cliente.
              </Text>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default CustomerDetailsPage;
