import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Group,
  ScrollArea,
  ActionIcon,
  Text,
  Box,
  Select,
  Grid,
  Input, // Adicionar Input
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconSearch } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useAuth } from '../contexts/AuthContext';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/customers.service';
import type { Customer } from '../types/customer';
import axios from 'axios';

const CustomersPage: React.FC = () => {
  const { user, token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      fullName: '',
      cpfCnpj: '',
      whatsapp: '',
      email: '',
      gender: '',
      birthDate: '',
      origin: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    validate: {
      fullName: (value) => (value.length < 3 ? 'Nome completo deve ter pelo menos 3 caracteres' : null),
      cpfCnpj: (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 11 && cleaned.length !== 14) {
          return 'CPF/CNPJ inválido';
        }
        return null;
      },
      whatsapp: (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10) {
          return 'Número de WhatsApp inválido';
        }
        return null;
      },
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      cep: (value) => (value.replace(/\D/g, '').length !== 8 ? 'CEP inválido' : null),
      street: (value) => (value.trim().length === 0 ? 'Rua é obrigatória' : null),
      number: (value) => (value.trim().length === 0 ? 'Número é obrigatório' : null),
      neighborhood: (value) => (value.trim().length === 0 ? 'Bairro é obrigatório' : null),
      city: (value) => (value.trim().length === 0 ? 'Cidade é obrigatória' : null),
      state: (value) => (value.trim().length !== 2 ? 'Estado deve ter 2 caracteres' : null),
    },
  });

  const fetchCustomers = async () => {
    if (user && token) {
      try {
        const data = await getCustomers(token);
        setCustomers(data);
      } catch (error) {
        notifications.show({
          title: 'Erro ao buscar clientes',
          message: 'Não foi possível carregar a lista de clientes.',
          color: 'red',
        });
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      customer.cpfCnpj.includes(search) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.currentTarget.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
          form.setValues({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Erro ao buscar CEP',
          message: 'Não foi possível encontrar o endereço para o CEP informado.',
          color: 'orange',
        });
      }
    }
  };

  const openModal = (customer: Customer | null) => {
    setEditingCustomer(customer);
    form.reset();
    if (customer) {
      form.setValues({
        ...customer,
        birthDate: customer.birthDate ? new Date(customer.birthDate).toISOString().split('T')[0] : '',
      });
    }
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !token) return;

    const customerData = {
        ...values,
        birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : undefined,
    };

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customerData, token);
        notifications.show({
          title: 'Cliente atualizado',
          message: 'O cliente foi atualizado com sucesso.',
          color: 'green',
        });
      } else {
        await createCustomer(customerData, token);
        notifications.show({
          title: 'Cliente criado',
          message: 'O novo cliente foi criado com sucesso.',
          color: 'green',
        });
      }
      close();
      fetchCustomers();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Ocorreu um erro ao salvar o cliente.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Excluir Cliente',
      centered: true,
      children: (
        <Text size="sm">
          Você tem certeza que deseja excluir este cliente? Esta ação é irreversível.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: "Cancelar" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (user && token) {
          try {
            await deleteCustomer(id, token);
            notifications.show({
              title: 'Cliente excluído',
              message: 'O cliente foi excluído com sucesso.',
              color: 'green',
            });
            fetchCustomers();
          } catch (error) {
            notifications.show({
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir o cliente.',
              color: 'red',
            });
          }
        }
      },
    });

  const rows = filteredCustomers.map((customer) => (
    <Table.Tr key={customer.id}>
      <Table.Td>{customer.fullName}</Table.Td>
      <Table.Td>{customer.cpfCnpj}</Table.Td>
      <Table.Td>{customer.whatsapp}</Table.Td>
      <Table.Td>{customer.email}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => openModal(customer)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(customer.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text fz="lg" fw={500}>
          Gestão de Clientes
        </Text>
        <Button onClick={() => openModal(null)}>Adicionar Cliente</Button>
      </Group>

      <TextInput
        placeholder="Buscar por nome, CPF/CNPJ ou e-mail"
        mb="md"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome Completo</Table.Th>
              <Table.Th>CPF/CNPJ</Table.Th>
              <Table.Th>WhatsApp</Table.Th>
              <Table.Th>E-mail</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={5}><Text ta="center">Nenhum cliente encontrado.</Text></Table.Td></Table.Tr>}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal opened={opened} onClose={close} title={editingCustomer ? 'Editar Cliente' : 'Adicionar Cliente'} size="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Nome Completo" placeholder="Nome do cliente" {...form.getInputProps('fullName')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input.Wrapper label="CPF/CNPJ" required error={form.errors.cpfCnpj}>
                <Input
                  component={IMaskInput}
                  mask={[
                    { mask: '000.000.000-00' },
                    { mask: '00.000.000/0000-00' },
                  ]}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  onAccept={(value: any) => form.setFieldValue('cpfCnpj', value)}
                  value={form.values.cpfCnpj}
                />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Input.Wrapper label="WhatsApp" required error={form.errors.whatsapp}>
                <Input
                  component={IMaskInput}
                  mask="(00) 00000-0000"
                  placeholder="(00) 00000-0000"
                  onAccept={(value: any) => form.setFieldValue('whatsapp', value)}
                  value={form.values.whatsapp}
                />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="E-mail" placeholder="contato@cliente.com" {...form.getInputProps('email')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                    label="Sexo"
                    placeholder="Selecione o sexo"
                    data={['Masculino', 'Feminino']}
                    {...form.getInputProps('gender')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                    label="Data de Nascimento"
                    type="date"
                    {...form.getInputProps('birthDate')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label="Origem" placeholder="Como nos conheceu?" {...form.getInputProps('origin')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput label="CEP" placeholder="00000-000" {...form.getInputProps('cep')} onBlur={handleCepBlur} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <TextInput label="Rua" placeholder="Nome da rua" {...form.getInputProps('street')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <TextInput label="Número" placeholder="123" {...form.getInputProps('number')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Complemento" placeholder="Apto, Bloco, etc." {...form.getInputProps('complement')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Bairro" placeholder="Bairro" {...form.getInputProps('neighborhood')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Cidade" placeholder="Cidade" {...form.getInputProps('city')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Estado" placeholder="UF" {...form.getInputProps('state')} required />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

export default CustomersPage;
