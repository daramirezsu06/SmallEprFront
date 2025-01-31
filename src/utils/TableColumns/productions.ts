export const ProductionColumns = [
  { name: "Id", selector: "id" },
  { name: "Cantidad Producida", selector: "quantity" },
  { name: "Costo Unitario", selector: "cost" },
  { name: "Costo Total", selector: "totalCost" },
  {
    name: "Orden de Producción",
    selector: (row: any) => row.productionOrder.id, // Id de la orden de producción relacionada
  },
  {
    name: "Producto",
    selector: (row: any) => row.productionOrder.product.name, // Nombre del producto relacionado
  },
  { name: "Fecha de Creación", selector: "createDate" },
];
