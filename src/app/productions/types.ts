export interface ProductionOrderItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    unit: {
      id: number;
      name: string;
      description: string;
      acronyms: string;
    };
  };
}

// export interface ProductionOrder {
//   id: number;
//   quantity: string; // La cantidad resultante de la producción
//   pending: boolean;
//   createDate: string;
//   product: {
//     id: number;
//     name: string;
//     description: string;
//   };
//   productionOrderItems: ProductionOrderItem[];
// }

export interface ProductionOrder {
  id: number;
  product: { name: string };
  quantity: number | string; // Puede ser string porque usas +row.quantity
  createDate: string;
  formulations: { name: string };
  productionOrderItems: ProductionOrderItem[];
  pending?: boolean; // Opcional, inferido del filtro
}

export interface CreateProductionDto {
  quantity: number;
  productionOrderId: number;
  productionItems: ProductionItemDto[];
}

export interface ProductionItemDto {
  productId: number;
  quantity: number;
}
