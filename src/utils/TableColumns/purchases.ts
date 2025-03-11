export const PurchaseColumns = [
  { name: "Id", selector: "id" },
  { name: "Fecha", selector: "date" },
  { name: "# factura", selector: "Factura" },
  {
    name: "proveedor",
    selector: (row: any) => row.supplier.name,
  }
];
