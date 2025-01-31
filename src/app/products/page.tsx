import { productOptions } from "@/utils/listOptions/productOptions";
import RenderOptions from "../components/Table/options";


export default function HomeProducts() {
  return <RenderOptions options={productOptions} />;
}
