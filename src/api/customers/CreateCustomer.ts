import { axiosApi } from "../api";
interface CreateCustomerDto {
  name: string;
  address: string;
  lat?: number;
  lon?: number;
  nit?: string;
  tel?: string;
  customerTypeId: number;
  sellerId?: number;
  priceListId?: number;
}

const CreateCustomer = async ({
  customerData,
}: {
  customerData: CreateCustomerDto;
}) => {
  try {
    const { data } = await axiosApi.post("/customer", customerData);
    return data;
  } catch (error: any) {
    // Si el error es de Axios, manejar con error.response, de lo contrario, usar el mensaje genérico
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};
export default CreateCustomer;
