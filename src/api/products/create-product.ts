import { axiosApi } from "../api";

// Este tipo es opcional, pero lo puedes usar para mejorar la claridad de los datos
type ProductData = {
  name: string;
  description: string;
  unitId: number;
  typeProductId: number;
  subTypeProductId: number;
};

const CreateProducts = async (productData: ProductData) => {
  try {
    // Realizamos la petición POST al backend enviando los datos del formulario
    const { data } = await axiosApi.post("/products", productData);
    return data; // Retornamos la respuesta del backend, que podría contener el producto creado o un mensaje de éxito.
  } catch (error: any) {
    // Si el error es de Axios, manejamos con error.response, de lo contrario, usamos el mensaje genérico.
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usamos `new Error` para seguir las buenas prácticas.
  }
};

export default CreateProducts;
