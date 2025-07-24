// Definição do tipo para a entidade Fornecedor, espelhando o backend.
export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
