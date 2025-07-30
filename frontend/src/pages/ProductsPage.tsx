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
  Card,
  Stack,
  Select,
  Divider,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconSearch, IconPlus, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products.service';
import { getInsums } from '../services/insums.service';
import type { Product, CreateProductData } from '../types/product';
import type { Insum } from '../types/insum';

interface CompositionItem {
  insumId: string;
  quantityUsed: number;
}

const ProductsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [insums, setInsums] = useState<Insum[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [composition, setComposition] = useState<CompositionItem[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      salePrice: 0,
    },
    validate: {
      name: (value) => (value.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : null),
      salePrice: (value) => (value <= 0 ? 'O preço de venda deve ser maior que zero' : null),
    },
  });

  // --- Lógica de Cálculo Memoizada ---
  const productionCost = useMemo(() => {
    return composition.reduce((total, item) => {
      const insum = insums.find(i => i.id === item.insumId);
      return total + (insum ? insum.averageCost * item.quantityUsed : 0);
    }, 0);
  }, [composition, insums]);

  const profitMargin = useMemo(() => {
    if (form.values.salePrice <= 0 || productionCost <= 0) return 0;
    return ((form.values.salePrice - productionCost) / form.values.salePrice) * 100;
  }, [form.values.salePrice, productionCost]);

  // --- Busca de Dados ---
  const fetchProducts = async () => {
    if (user && token) {
      try {
        const data = await getProducts(token);
        setProducts(data);
      } catch (error) {
        notifications.show({
          title: 'Erro ao buscar produtos',
          message: 'Não foi possível carregar a lista de produtos.',
          color: 'red',
        });
      }
    }
  };

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
    if (user && token) {
      fetchProducts();
      fetchInsums();
    }
  }, [user, token]);

  // --- Manipuladores de Eventos e Estado ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const insumOptions = useMemo(() => 
    insums.map(insum => ({
      value: insum.id,
      label: `${insum.name} (${insum.unitOfMeasurement})`,
    })),
  [insums]);

  const addCompositionItem = () => {
    setComposition(prev => [...prev, { insumId: '', quantityUsed: 1 }]);
  };

  const removeCompositionItem = (index: number) => {
    setComposition(prev => prev.filter((_, i) => i !== index));
  };

  const updateCompositionItem = (index: number, field: keyof CompositionItem, value: string | number) => {
    setComposition(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const openModal = (product: Product | null) => {
    setEditingProduct(product);
    form.reset();
    
    if (product) {
      form.setValues({
        name: product.name,
        salePrice: product.salePrice,
      });
      const existingComposition = product.composition.map(comp => ({
        insumId: comp.insum.id,
        quantityUsed: comp.quantityUsed,
      }));
      setComposition(existingComposition);
    } else {
      setComposition([]);
    }
    
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !token) return;

    if (composition.length === 0 || composition.some(item => !item.insumId || item.quantityUsed <= 0)) {
      notifications.show({
        title: 'Erro de Validação',
        message: 'A composição deve ter pelo menos um insumo com quantidade válida.',
        color: 'red',
      });
      return;
    }

    const productData: CreateProductData = { ...values, composition };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, token);
        notifications.show({ title: 'Sucesso', message: 'Produto atualizado com sucesso.', color: 'green' });
      } else {
        await createProduct(productData, token);
        notifications.show({ title: 'Sucesso', message: 'Produto criado com sucesso.', color: 'green' });
      }
      close();
      fetchProducts();
    } catch (error) {
      notifications.show({ title: 'Erro', message: 'Ocorreu um erro ao salvar o produto.', color: 'red' });
    }
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Excluir Produto',
      centered: true,
      children: <Text size="sm">Tem certeza que deseja excluir este produto? Esta ação é irreversível.</Text>,
      labels: { confirm: 'Excluir', cancel: "Cancelar" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (user && token) {
          try {
            await deleteProduct(id, token);
            notifications.show({ title: 'Produto Excluído', message: 'O produto foi excluído com sucesso.', color: 'green' });
            fetchProducts();
          } catch (error) {
            notifications.show({ title: 'Erro', message: 'Não foi possível excluir o produto.', color: 'red' });
          }
        }
      },
    });

  // --- Funções de Cálculo para a Tabela ---
  const getProductCost = (product: Product): number => {
    const cost = product.productionCost ?? product.composition.reduce((total, comp) => total + (comp.insum.averageCost * comp.quantityUsed), 0);
    return Number(cost);
  };

  const getProductMargin = (product: Product) => {
    const cost = getProductCost(product);
    if (product.salePrice <= 0 || cost <= 0) return 0;
    return ((product.salePrice - cost) / product.salePrice) * 100;
  };

  // --- Renderização ---
  const rows = filteredProducts.map((product) => {
    const margin = getProductMargin(product);
    const marginColor = margin > 20 ? 'green' : margin > 10 ? 'yellow' : 'red';
    return (
      <Table.Tr key={product.id}>
        <Table.Td>{product.name}</Table.Td>
        <Table.Td>R$ {Number(product.salePrice || 0).toFixed(2)}</Table.Td>
        <Table.Td>R$ {getProductCost(product).toFixed(2)}</Table.Td>
        <Table.Td><Badge color={marginColor}>{margin.toFixed(1)}%</Badge></Table.Td>
        <Table.Td>{product.composition.length} insumos</Table.Td>
        <Table.Td>
          <Group gap="xs">
            <ActionIcon variant="subtle" color="blue" onClick={() => openModal(product)}><IconPencil size={16} /></ActionIcon>
            <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(product.id)}><IconTrash size={16} /></ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text fz="lg" fw={500}>Gestão de Produtos</Text>
        <Button onClick={() => openModal(null)}>Adicionar Produto</Button>
      </Group>

      <TextInput
        placeholder="Buscar por nome do produto"
        mb="md"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome do Produto</Table.Th>
              <Table.Th>Preço de Venda</Table.Th>
              <Table.Th>Custo de Produção</Table.Th>
              <Table.Th>Margem de Lucro</Table.Th>
              <Table.Th>Composição</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={6}><Text ta="center">Nenhum produto encontrado.</Text></Table.Td></Table.Tr>}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'} 
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput label="Nome do Produto" placeholder="Ex: Caneca Personalizada" {...form.getInputProps('name')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput label="Preço de Venda (R$)" placeholder="0.00" step={0.01} min={0} {...form.getInputProps('salePrice')} required />
            </Grid.Col>
          </Grid>

          <Divider my="lg" />

          <Card withBorder p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>Ficha de Composição</Text>
                <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={addCompositionItem} disabled={insums.length === 0}>
                  Adicionar Insumo
                </Button>
              </Group>

              {composition.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">Nenhum insumo adicionado.</Text>
              ) : (
                <Stack gap="sm">
                  {composition.map((item, index) => {
                    const selectedInsum = insums.find(i => i.id === item.insumId);
                    const itemCost = selectedInsum ? selectedInsum.averageCost * item.quantityUsed : 0;
                    return (
                      <Group key={index} align="flex-start" wrap="nowrap">
                        <Select
                          label="Insumo"
                          placeholder="Selecione um insumo"
                          data={insumOptions}
                          value={item.insumId}
                          onChange={(value) => updateCompositionItem(index, 'insumId', value || '')}
                          searchable
                          required
                          comboboxProps={{ withinPortal: true }}
                          style={{ flex: 1 }}
                        />
                        <NumberInput
                          label="Quantidade"
                          placeholder="1"
                          min={0.01}
                          step={0.1}
                          value={item.quantityUsed}
                          onChange={(value) => updateCompositionItem(index, 'quantityUsed', Number(value) || 0)}
                          style={{ width: 120 }}
                          required
                        />
                        <Box style={{ width: 100, paddingTop: 28 }}>
                           <Text size="sm" c="dimmed">Custo: R$ {itemCost.toFixed(2)}</Text>
                        </Box>
                        <ActionIcon color="red" onClick={() => removeCompositionItem(index)} style={{ marginTop: 28 }}>
                          <IconX size={16} />
                        </ActionIcon>
                      </Group>
                    );
                  })}
                </Stack>
              )}

              <Divider />

              <Group justify="space-between" align="center">
                  <Text size="lg" fw={500}>Custo Total: <Text span c="blue" fw={700}>R$ {productionCost.toFixed(2)}</Text></Text>
                  <Text size="sm" c="dimmed">Margem: <Text span c={profitMargin > 20 ? 'green' : profitMargin > 10 ? 'yellow' : 'red'} fw={500}>{profitMargin.toFixed(1)}%</Text></Text>
              </Group>
            </Stack>
          </Card>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancelar</Button>
            <Button type="submit">Salvar Produto</Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

export default ProductsPage;