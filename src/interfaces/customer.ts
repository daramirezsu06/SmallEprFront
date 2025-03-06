export interface ICustomer {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  nit: string;
  tel: string;
  createDate: Date;
  updateDate: null;
  seller: Seller;
  priceList: PriceList;
}

export interface PriceListItem {
  id: number;
  price: string;
  createDate: Date;
  updateDate: null;
  product: PriceList;
}

export interface PriceList {
  id: number;
  name: string;
  description: string;
  createDate: Date;
  updateDate: null;
  priceListItems?: PriceListItem[];
}

export interface Seller {
  id: number;
  name: string;
  lastName: string;
  cedula: string;
  createDate: Date;
  updateDate: null;
}
