export const InventoryMovementsColumns = [
  { name: "Id", selector: "id" },
  { name: "Costo", selector: "cost" },
  { name: "Cantidad", selector: "quantity" },
  {
    name: "Producto",
    selector: (row: any) => row.product.name,
  },
  { name: "tipo", selector: (row: any) => row.movementType.name },
  { name: "Fecha", selector: "createDate" },
];
