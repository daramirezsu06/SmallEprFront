import { Table } from "../../../components/Table/tableContainer";
import GetSubTypeOfProducts from "@/api/products/type-of-products/get-sub-types-of-products";
import { SubProductTypeColumns } from "@/utils/TableColumns/subProductType";

export default async function Page() {
  const data = await GetSubTypeOfProducts();
  return (
    <div>
      <Table data={data} columns={SubProductTypeColumns} />
    </div>
  );
}
