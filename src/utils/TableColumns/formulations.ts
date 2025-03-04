interface Formulation {
  id: number;
  name: string;
  cuantity: number;
  createDate: string;
  product: { name: string };
}

export const FormulationColumns: {
  name: string;
  selector: keyof Formulation | ((row: Formulation) => React.ReactNode);
}[] = [
  { name: "Id", selector: "id" }, // keyof Formulation
  { name: "Nombre", selector: "name" }, // keyof Formulation
  { name: "Cantidad", selector: "cuantity" }, // keyof Formulation
  { name: "Producto", selector: (row: Formulation) => row.product.name }, // Función con tipo correcto
  { name: "Fecha de Creación", selector: "createDate" }, // keyof Formulation
];
