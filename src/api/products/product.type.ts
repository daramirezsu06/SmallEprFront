export interface Product {
  id: number;
  name: string;
  description: string;
  createDate: string;
  updateDate: null | string;
  unit: {
    id: number;
    name: string;
    acronyms: string;
  };
  typeProduct: {
    id: number;
    name: string;
    subTypeProduct: {
      id: number;
      name: string;
    };
  };
}
