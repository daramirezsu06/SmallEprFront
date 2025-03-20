export const SellColumns = [
  { name: "Id", selector: "id" },
  { name: "Cantidad", selector: "quantity" },
  { name: "Costo Total", selector: "totalCost" },
  { name: "Valor Total", selector: "totalPrice" },
  { name: "Pagado", selector: "paid" },
  { name: "Fecha de Creacion", selector: "createDate" },
  {
    name: "Vendedor",
    selector: (row: any) => row.seller.name,
  },
  { name: "Cliente", selector: (row: any) => row.customer.name }
];
