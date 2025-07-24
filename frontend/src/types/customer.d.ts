// Definição do tipo para a entidade Cliente, espelhando o backend.
export interface Customer {
  id: string;
  fullName: string;
  cpfCnpj: string;
  whatsapp: string;
  email: string;
  gender?: string;
  birthDate?: string;
  origin?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}
