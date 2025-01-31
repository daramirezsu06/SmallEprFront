import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";
import GetUnits from "@/api/products/units/get-units";
import ProductForm from "./components/formulario";

export default async function Page() {
  const typeProducts = await GetTypeOfProducts();
  const units = await GetUnits();
  return <ProductForm productTypes={typeProducts} units={units} />;
}
