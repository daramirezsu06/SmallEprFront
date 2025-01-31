import { Table } from "../../components/Table/tableContainer";

import GetInventorieMovements from "@/api/inventory/get-inventorie-movements";
import { InventoryMovementsColumns } from "@/utils/TableColumns/inventorieMovements";

export default async function Page() {
  const data = await GetInventorieMovements();
  return (
    <div>
      <h1>movimientos de inventario</h1>
      <Table data={data} columns={InventoryMovementsColumns} />
    </div>
  );
}
