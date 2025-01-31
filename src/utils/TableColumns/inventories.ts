export const InventoryColumns = [
  { name: "Id", selector: "id" },
  { name: "Costo", selector: "cost" },
  { name: "Cantidad", selector: "quantity" },
  {
    name: "Producto",
    selector: (row: any) => row.product.name,
  },
];
