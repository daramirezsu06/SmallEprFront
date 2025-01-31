export const FormulationColumns = [
  { name: "Id", selector: "id" },
  { name: "Nombre", selector: "name" },
  { name: "Cantidad", selector: "cuantity" },
  { name: "Producto", selector: (row: any) => row.product.name }, // Acceder al nombre del producto
  { name: "Fecha de Creación", selector: "createDate" },
  
];
