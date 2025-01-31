import { Table } from "../../../components/Table/tableContainer";

import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";
import { ProductTypeColumns } from "@/utils/TableColumns/productType";

export default async function Page() {
  const data = await GetTypeOfProducts();
  return (
    <div>
      <Table data={data} columns={ProductTypeColumns} />
    </div>
  );
}
