import { Table } from "../../components/Table/tableContainer";
import GetAllSells from "@/api/sells/get_all_sells";
import { SellColumns } from "@/utils/TableColumns/sells";

export default async function Page() {
  const products = await GetAllSells();
  return (
    <div>
      <Table data={products} columns={SellColumns} />
    </div>
  );
}
