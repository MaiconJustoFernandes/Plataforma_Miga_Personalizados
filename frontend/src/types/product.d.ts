// Definição do tipo para a entidade Produto, espelhando o backend.
import type { Insum } from './insum';

export interface ProductComposition {
  id: string;
  insum: Insum;
  quantityUsed: number;
}

export interface Product {
  id: string;
  name: string;
  salePrice: number;
  productionCost: number;
  profitMargin: number;
  composition: ProductComposition[];
  createdAt: string;
  updatedAt: string;
}

// Tipo para criação de produtos
export interface CreateProductData {
  name: string;
  salePrice: number;
  composition: {
    insumId: string;
    quantityUsed: number;
  }[];
}
