import { axiosApi } from "../api";
interface sellItem {
  productId: number;
  quantity: number;
  price: number;
}
export interface SellData {
  customerId: number;
  type: string;
  sellItems: sellItem[];
  bill?: string;
}

const CreateSell = async (sellData: SellData) => {
  try {
    const { data } = await axiosApi.post("/sells", sellData);
    return data;
  } catch (error: any) {
    // Si el error es de Axios, manejar con error.response, de lo contrario, usar el mensaje genérico
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};
export default CreateSell;
