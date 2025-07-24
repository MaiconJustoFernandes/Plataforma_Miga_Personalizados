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
  NumberInput,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useAuth } from '../contexts/AuthContext';
import { getInsums, createInsum, updateInsum, deleteInsum } from '../services/insums.service';
import type { Insum } from '../types/insum';

const InsumsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [insums, setInsums] = useState<Insum[]>([]);
  const [editingInsum, setEditingInsum] = useState<Insum | null>(null);
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      unitOfMeasurement: '',
      currentStock: 0,
      averageCost: 0,
    },
    validate: {
      name: (value) => (value.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : null),
      unitOfMeasurement: (value) => (value.length === 0 ? 'Unidade de medida é obrigatória' : null),
      currentStock: (value) => (value < 0 ? 'Estoque não pode ser negativo' : null),
      averageCost: (value) => (value < 0 ? 'Custo não pode ser negativo' : null),
    },
  });

  const fetchInsums = async () => {
    if (user && token) {
      try {
        const data = await getInsums(token);
        setInsums(data);
      } catch (error) {
        notifications.show({
          title: 'Erro ao buscar insumos',
          message: 'Não foi possível carregar a lista de insumos.',
          color: 'red',
        });
      }
    }
  };

  useEffect(() => {
    fetchInsums();
  }, [user]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredInsums = useMemo(() => {
    return insums.filter((insum) =>
      insum.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [insums, search]);

  const openModal = (insum: Insum | null) => {
    setEditingInsum(insum);
    form.reset();
    if (insum) {
      form.setValues(insum);
    }
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !token) return;

    try {
      if (editingInsum) {
        await updateInsum(editingInsum.id, values, token);
        notifications.show({
          title: 'Insumo atualizado',
          message: 'O insumo foi atualizado com sucesso.',
          color: 'green',
        });
      } else {
        await createInsum(values, token);
        notifications.show({
          title: 'Insumo criado',
          message: 'O novo insumo foi criado com sucesso.',
          color: 'green',
        });
      }
      close();
      fetchInsums();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Ocorreu um erro ao salvar o insumo.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Excluir Insumo',
      centered: true,
      children: (
        <Text size="sm">
          Você tem certeza que deseja excluir este insumo? Esta ação é irreversível.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: "Cancelar" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (user && token) {
          try {
            await deleteInsum(id, token);
            notifications.show({
              title: 'Insumo excluído',
              message: 'O insumo foi excluído com sucesso.',
              color: 'green',
            });
            fetchInsums();
          } catch (error) {
            notifications.show({
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir o insumo.',
              color: 'red',
            });
          }
        }
      },
    });

  const rows = filteredInsums.map((insum) => (
    <Table.Tr key={insum.id}>
      <Table.Td>{insum.name}</Table.Td>
      <Table.Td>{insum.unitOfMeasurement}</Table.Td>
      <Table.Td>{Number(insum.currentStock || 0)}</Table.Td>
      <Table.Td>R$ {Number(insum.averageCost || 0).toFixed(2)}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => openModal(insum)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(insum.id)}>
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
          Gestão de Insumos
        </Text>
        <Button onClick={() => openModal(null)}>Adicionar Insumo</Button>
      </Group>

      <TextInput
        placeholder="Buscar por nome do insumo"
        mb="md"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome do Insumo</Table.Th>
              <Table.Th>Unidade de Medida</Table.Th>
              <Table.Th>Estoque Atual</Table.Th>
              <Table.Th>Custo Médio</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={5}><Text ta="center">Nenhum insumo encontrado.</Text></Table.Td></Table.Tr>}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal opened={opened} onClose={close} title={editingInsum ? 'Editar Insumo' : 'Adicionar Insumo'} size="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput label="Nome do Insumo" placeholder="Ex: Caneca de Porcelana" {...form.getInputProps('name')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Unidade de Medida"
                placeholder="Selecione a unidade"
                data={[
                  'UN (Unidade)',
                  'KG (Quilograma)',
                  'G (Grama)',
                  'L (Litro)',
                  'ML (Mililitro)',
                  'M (Metro)',
                  'CM (Centímetro)',
                  'M² (Metro Quadrado)',
                  'M³ (Metro Cúbico)',
                  'PC (Peça)',
                  'CX (Caixa)',
                  'PCT (Pacote)'
                ]}
                {...form.getInputProps('unitOfMeasurement')}
                searchable
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
               <NumberInput
                label="Estoque Atual"
                placeholder="0"
                min={0}
                {...form.getInputProps('currentStock')}
                required
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Custo Médio (R$)"
                placeholder="0.00"
                step={0.01}
                min={0}
                {...form.getInputProps('averageCost')}
                required
              />
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

export default InsumsPage;
