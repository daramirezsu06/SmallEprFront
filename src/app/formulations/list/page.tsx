import { FormulationColumns } from "@/utils/TableColumns/formulations";
import { Table } from "../../components/Table/tableContainer";
import GetFormulations from "@/api/formulations/get-formulations";

export default async function FormulationList() {
  const data = await GetFormulations();
  return (
    <div>
      <h1>Formulations</h1>
      <Table data={data} columns={FormulationColumns} />
    </div>
  );
}
