import { Table } from "../../../components/Table/tableContainer";
import GetSuppliers from "@/api/purchases/get-Suppliers";
import { SuppliersColumns } from "@/utils/TableColumns/inventories copy";

export default async function Page() {
  const data = await GetSuppliers();
  return (
    <div>
      <h1>Inventory</h1>
      <Table data={data} columns={SuppliersColumns} />
    </div>
  );
}
