export const Productcolumns = [
  { name: "Id", selector: "id" },
  { name: "Name", selector: "name" },
  { name: "Description", selector: "description" },
  {
    name: "Tipo",
    selector: (row: any) => row.typeProduct.acronyms,
  },
  { name: "unidad", selector: (row: any) => row.unit.acronyms },
  { name: "subTipo", selector: (row: any) => row.subTypeProduct.acronyms },
];
