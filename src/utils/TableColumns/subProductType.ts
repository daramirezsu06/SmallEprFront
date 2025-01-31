export const SubProductTypeColumns = [
  { name: "Id", selector: "id" },
  { name: "Nombre", selector: "name" },
  { name: "Descripción", selector: "description" },
  { name: "Acronimo", selector: "acronyms" },
  {
    name: "Tipo de Producto",
    selector: (row: any) => row.typeProduct.name, // Id de la orden de producción relacionada
  },

  { name: "Fecha de Creación", selector: "createDate" },
];
