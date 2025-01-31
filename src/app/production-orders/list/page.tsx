import { ProductionOrderColumns } from "@/utils/TableColumns/productionsOrders";
import { Table } from "../../components/Table/tableContainer";
import GetProductionsOrders from "@/api/production-orders/get-productions-orders";

export default async function Page() {
  const data = await GetProductionsOrders();
  return (
    <div>
      <h1>Production Orders</h1>
      <Table data={data} columns={ProductionOrderColumns} />
    </div>
  );
}
