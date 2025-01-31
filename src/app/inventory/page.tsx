import { inventoryOptions } from "@/utils/listOptions/inventoryOptions";
import RenderOptions from "../components/Table/options";

export default function Formulations() {
  return <RenderOptions options={inventoryOptions} />;
}
