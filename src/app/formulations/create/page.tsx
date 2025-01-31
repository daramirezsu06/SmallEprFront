import GetProducts from "@/api/products/get-products";
import FormulationForm from "./components/form";

export default async function Page() {
  const data = await GetProducts();
  return <FormulationForm products={data} />;
}
