import { axiosApi } from "../api";

type purchaseItem = {
  productId: number;
  quantity: number;
  cost: number;
};
type CreatePurchaseData = {
  supplerId: number;
  factura: number;
  data: string;
  CreateInventoryMovementsDto: purchaseItem[];
};
const CreatePurchase = async (purchaseData: CreatePurchaseData) => {
  try {
    const { data } = await axiosApi.post("/purchases", purchaseData);
    return data;
  } catch (error: any) {
    // Si el error es de Axios, manejar con error.response, de lo contrario, usar el mensaje genérico
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};
export default CreatePurchase;
