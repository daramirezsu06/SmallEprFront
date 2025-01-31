import { Table } from "../../../components/Table/tableContainer";
import GetUnits from "@/api/products/units/get-units";
import { UnitColumns } from "@/utils/TableColumns/units";

export default async function Page() {
  const data = await GetUnits();
  return (
    <div>
      <Table data={data} columns={UnitColumns} />
    </div>
  );
}
