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
  Grid,
  Input,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconSearch } from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useAuth } from '../contexts/AuthContext';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/suppliers.service';
import type { Supplier } from '../types/supplier';

const SuppliersPage: React.FC = () => {
  const { user, token } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
    },
    validate: {
      name: (value) => (value.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : null),
      cnpj: (value) => (value.replace(/\D/g, '').length !== 14 ? 'CNPJ inválido' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      phone: (value) => (value.replace(/\D/g, '').length < 10 ? 'Telefone inválido' : null),
    },
  });

  const fetchSuppliers = async () => {
    if (user && token) {
      try {
        const data = await getSuppliers(token);
        setSuppliers(data);
      } catch (error) {
        notifications.show({
          title: 'Erro ao buscar fornecedores',
          message: 'Não foi possível carregar a lista de fornecedores.',
          color: 'red',
        });
      }
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [user]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.cnpj.includes(search) ||
      supplier.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const openModal = (supplier: Supplier | null) => {
    setEditingSupplier(supplier);
    form.reset();
    if (supplier) {
      form.setValues(supplier);
    }
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !token) return;

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, values, token);
        notifications.show({
          title: 'Fornecedor atualizado',
          message: 'O fornecedor foi atualizado com sucesso.',
          color: 'green',
        });
      } else {
        await createSupplier(values, token);
        notifications.show({
          title: 'Fornecedor criado',
          message: 'O novo fornecedor foi criado com sucesso.',
          color: 'green',
        });
      }
      close();
      fetchSuppliers();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Ocorreu um erro ao salvar o fornecedor.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Excluir Fornecedor',
      centered: true,
      children: (
        <Text size="sm">
          Você tem certeza que deseja excluir este fornecedor? Esta ação é irreversível.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: "Cancelar" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (user && token) {
          try {
            await deleteSupplier(id, token);
            notifications.show({
              title: 'Fornecedor excluído',
              message: 'O fornecedor foi excluído com sucesso.',
              color: 'green',
            });
            fetchSuppliers();
          } catch (error) {
            notifications.show({
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir o fornecedor.',
              color: 'red',
            });
          }
        }
      },
    });

  const rows = filteredSuppliers.map((supplier) => (
    <Table.Tr key={supplier.id}>
      <Table.Td>{supplier.name}</Table.Td>
      <Table.Td>{supplier.cnpj}</Table.Td>
      <Table.Td>{supplier.email}</Table.Td>
      <Table.Td>{supplier.phone}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => openModal(supplier)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(supplier.id)}>
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
          Gestão de Fornecedores
        </Text>
        <Button onClick={() => openModal(null)}>Adicionar Fornecedor</Button>
      </Group>

      <TextInput
        placeholder="Buscar por nome, CNPJ ou e-mail"
        mb="md"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>CNPJ</Table.Th>
              <Table.Th>E-mail</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={5}><Text ta="center">Nenhum fornecedor encontrado.</Text></Table.Td></Table.Tr>}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal opened={opened} onClose={close} title={editingSupplier ? 'Editar Fornecedor' : 'Adicionar Fornecedor'} size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput label="Nome" placeholder="Nome do fornecedor" {...form.getInputProps('name')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Input.Wrapper label="CNPJ" required error={form.errors.cnpj}>
                    <Input
                        component={IMaskInput}
                        mask="00.000.000/0000-00"
                        placeholder="00.000.000/0000-00"
                        onAccept={(value: any) => form.setFieldValue('cnpj', value)}
                        value={form.values.cnpj}
                    />
                </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="E-mail" placeholder="contato@fornecedor.com" {...form.getInputProps('email')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Input.Wrapper label="Telefone" required error={form.errors.phone}>
                    <Input
                        component={IMaskInput}
                        mask="(00) 00000-0000"
                        placeholder="(00) 00000-0000"
                        onAccept={(value: any) => form.setFieldValue('phone', value)}
                        value={form.values.phone}
                    />
                </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Endereço" placeholder="Endereço completo" {...form.getInputProps('address')} />
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

export default SuppliersPage;
