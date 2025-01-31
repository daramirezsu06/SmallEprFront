export const ProductionOrderColumns = [
  { name: "Id", selector: "id" },
  { name: "Cantidad", selector: "quantity" },
  { name: "Pendiente", selector: (row: any) => (row.pending ? "Sí" : "No") }, // Si la orden está pendiente o no
  { name: "Producto", selector: (row: any) => row.product.name }, // Nombre del producto relacionado
  { name: "Formulación", selector: (row: any) => row.formulations.name }, // Nombre de la formulación relacionada
  { name: "Fecha de Creación", selector: "createDate" },
];
