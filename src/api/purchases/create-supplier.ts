import { axiosApi } from "../api";

type CreateSupplierData = {
  name: string;
  address: string;
  tel: string;
  NIT: string;
};
const CreateSupplier = async (supplierData: CreateSupplierData) => {
  try {
    const { data } = await axiosApi.post("/purchases/suppliers", supplierData);
    return data;
  } catch (error: any) {
    // Si el error es de Axios, manejar con error.response, de lo contrario, usar el mensaje genérico
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};
export default CreateSupplier;
