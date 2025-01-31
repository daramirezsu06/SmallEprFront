import GetProducts from "@/api/products/get-products";
import { Table } from "../../components/Table/tableContainer";
import { Productcolumns } from "@/utils/TableColumns/product";

export default async function Page() {
  const products = await GetProducts();
  return (
    <div>
      <Table data={products} columns={Productcolumns} />
    </div>
  );
}
