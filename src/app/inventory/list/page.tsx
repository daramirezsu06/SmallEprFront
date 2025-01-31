import { InventoryColumns } from "@/utils/TableColumns/inventories";
import { Table } from "../../components/Table/tableContainer";
import GetInventories from "@/api/inventory/get-inventories";

export default async function Page() {
  const data = await GetInventories();
  return (
    <div>
      <h1>Inventory</h1>
      <Table data={data} columns={InventoryColumns} />
    </div>
  );
}
