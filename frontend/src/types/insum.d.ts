// Definição do tipo para a entidade Insumo, espelhando o backend.
export interface Insum {
  id: string;
  name: string;
  unitOfMeasurement: string;
  currentStock: number;
  averageCost: number;
  createdAt: string;
  updatedAt: string;
}
