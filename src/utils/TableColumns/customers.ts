interface Customer {
  id: number;
  name: string;
  address: string;
  tel: string;
  createDate: string;
  seller: { name: string };
}

export const CustomerColumns: {
  name: string;
  selector: keyof Customer | ((row: Customer) => React.ReactNode);
}[] = [
  { name: "Id", selector: "id" }, // keyof Formulation
  { name: "Nombre", selector: "name" }, // keyof Formulation
  { name: "address", selector: "address" }, // keyof Formulation
  { name: "Teléfono", selector: "tel" }, // keyof Formulation
  { name: "Fecha de Creación", selector: "createDate" }, // keyof Formulation
  { name: "Vendedor", selector: (row: Customer) => row.seller.name }, // Función con tipo correcto
];
