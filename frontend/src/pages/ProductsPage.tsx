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

  // Cálculo do custo de produção em tempo real
  const productionCost = useMemo(() => {
    return composition.reduce((total, item) => {
      const insum = insums.find(i => i.id === item.insumId);
      if (insum) {
        return total + (insum.averageCost * item.quantityUsed);
      }
      return total;
    }, 0);
  }, [composition, insums]);

  // Cálculo da margem de lucro
  const profitMargin = useMemo(() => {
    if (form.values.salePrice <= 0 || productionCost <= 0) return 0;
    return ((form.values.salePrice - productionCost) / form.values.salePrice) * 100;
  }, [form.values.salePrice, productionCost]);

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
    fetchProducts();
    fetchInsums();
  }, [user]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addCompositionItem = () => {
    setComposition(prev => [...prev, { insumId: '', quantityUsed: 0 }]);
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
    setComposition([]);
    
    if (product) {
      form.setValues({
        name: product.name,
        salePrice: product.salePrice,
      });
      
      // Carregar composição existente
      const existingComposition = product.composition.map(comp => ({
        insumId: comp.insum.id,
        quantityUsed: comp.quantityUsed,
      }));
      setComposition(existingComposition);
    }
    
    open();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!user || !token) return;

    // Validar composição
    if (composition.length === 0) {
      notifications.show({
        title: 'Erro de validação',
        message: 'É necessário adicionar pelo menos um insumo à composição.',
        color: 'red',
      });
      return;
    }

    const hasInvalidComposition = composition.some(item => 
      !item.insumId || item.quantityUsed <= 0
    );

    if (hasInvalidComposition) {
      notifications.show({
        title: 'Erro de validação',
        message: 'Todos os insumos devem ter uma quantidade válida.',
        color: 'red',
      });
      return;
    }

    const productData: CreateProductData = {
      ...values,
      composition: composition,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, token);
        notifications.show({
          title: 'Produto atualizado',
          message: 'O produto foi atualizado com sucesso.',
          color: 'green',
        });
      } else {
        await createProduct(productData, token);
        notifications.show({
          title: 'Produto criado',
          message: 'O novo produto foi criado com sucesso.',
          color: 'green',
        });
      }
      close();
      fetchProducts();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Ocorreu um erro ao salvar o produto.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: 'Excluir Produto',
      centered: true,
      children: (
        <Text size="sm">
          Você tem certeza que deseja excluir este produto? Esta ação é irreversível.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: "Cancelar" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (user && token) {
          try {
            await deleteProduct(id, token);
            notifications.show({
              title: 'Produto excluído',
              message: 'O produto foi excluído com sucesso.',
              color: 'green',
            });
            fetchProducts();
          } catch (error) {
            notifications.show({
              title: 'Erro ao excluir',
              message: 'Não foi possível excluir o produto.',
              color: 'red',
            });
          }
        }
      },
    });

  const getProductCost = (product: Product) => {
    // Se o backend ainda não calculou, calcular no frontend
    if (!product.productionCost || product.productionCost === 0) {
      return product.composition.reduce((total, comp) => {
        return total + (comp.insum.averageCost * comp.quantityUsed);
      }, 0);
    }
    return product.productionCost;
  };

  const getProductMargin = (product: Product) => {
    // Se o backend ainda não calculou, calcular no frontend
    if (!product.profitMargin || product.profitMargin === 0) {
      const cost = getProductCost(product);
      if (product.salePrice <= 0 || cost <= 0) return 0;
      return ((product.salePrice - cost) / product.salePrice) * 100;
    }
    return product.profitMargin;
  };

  const rows = filteredProducts.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>{product.name}</Table.Td>
      <Table.Td>R$ {Number(product.salePrice || 0).toFixed(2)}</Table.Td>
      <Table.Td>R$ {getProductCost(product).toFixed(2)}</Table.Td>
      <Table.Td>
        <Badge color={getProductMargin(product) > 20 ? 'green' : getProductMargin(product) > 10 ? 'yellow' : 'red'}>
          {getProductMargin(product).toFixed(1)}%
        </Badge>
      </Table.Td>
      <Table.Td>{product.composition.length} insumos</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => openModal(product)}>
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(product.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const availableInsums = insums.filter(insum => 
    !composition.some(comp => comp.insumId === insum.id)
  );

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text fz="lg" fw={500}>
          Gestão de Produtos
        </Text>
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
          <Table.Tbody>{rows.length > 0 ? rows : <Table.Tr><Table.Td colSpan={6}><Text ta="center">Nenhum produto encontrado.</Text></Table.Td></Table.Tr>}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Modal opened={opened} onClose={close} title={editingProduct ? 'Editar Produto' : 'Adicionar Produto'} size="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput label="Nome do Produto" placeholder="Ex: Caneca Personalizada" {...form.getInputProps('name')} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Preço de Venda (R$)"
                placeholder="0.00"
                step={0.01}
                min={0}
                {...form.getInputProps('salePrice')}
                required
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>Ficha de Composição</Text>
                <Button 
                  size="xs" 
                  variant="light" 
                  leftSection={<IconPlus size={14} />}
                  onClick={addCompositionItem}
                  disabled={availableInsums.length === 0}
                >
                  Adicionar Insumo
                </Button>
              </Group>

              {composition.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">
                  Nenhum insumo adicionado. Clique em "Adicionar Insumo" para começar.
                </Text>
              ) : (
                <Stack gap="sm">
                  {composition.map((item, index) => (
                    <Group key={index} align="end">
                      <Select
                        label="Insumo"
                        placeholder="Selecione um insumo"
                        data={[
                          ...insums
                            .filter(insum => insum.id === item.insumId)
                            .map(insum => ({
                              value: insum.id,
                              label: `${insum.name} (${insum.unitOfMeasurement})`,
                            })),
                          ...availableInsums.map(insum => ({
                            value: insum.id,
                            label: `${insum.name} (${insum.unitOfMeasurement})`,
                          }))
                        ]}
                        value={item.insumId}
                        onChange={(value) => updateCompositionItem(index, 'insumId', value || '')}
                        style={{ flex: 1 }}
                        required
                      />
                      <NumberInput
                        label="Quantidade"
                        placeholder="0"
                        min={0}
                        step={0.1}
                        value={item.quantityUsed}
                        onChange={(value) => updateCompositionItem(index, 'quantityUsed', Number(value) || 0)}
                        style={{ width: '120px' }}
                        required
                      />
                      <Text size="sm" c="dimmed" style={{ width: '80px' }}>
                        {item.insumId ? `R$ ${(insums.find(i => i.id === item.insumId)?.averageCost || 0).toFixed(2)}` : '-'}
                      </Text>
                      <ActionIcon color="red" onClick={() => removeCompositionItem(index)}>
                        <IconX size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              )}

              <Divider />

              <Group justify="space-between">
                <div>
                  <Text size="lg" fw={500}>
                    Custo de Produção Calculado: 
                    <Text span c="blue" ml="xs">R$ {productionCost.toFixed(2)}</Text>
                  </Text>
                  <Text size="sm" c="dimmed">
                    Margem de Lucro Calculada: 
                    <Text 
                      span 
                      c={profitMargin > 20 ? 'green' : profitMargin > 10 ? 'yellow' : 'red'} 
                      ml="xs"
                    >
                      {profitMargin.toFixed(1)}%
                    </Text>
                  </Text>
                </div>
              </Group>
            </Stack>
          </Card>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

export default ProductsPage;