import { ProductionColumns } from "@/utils/TableColumns/productions";
import { Table } from "../../components/Table/tableContainer";
import GetProductions from "@/api/productions/get-productions";

export default async function Page() {
  const data = await GetProductions();
  return (
    <div>
      <h1>Productions </h1>
      <Table data={data} columns={ProductionColumns} />
    </div>
  );
}
