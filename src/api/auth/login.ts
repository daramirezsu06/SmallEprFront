import { axiosApi } from "../api";

const postLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
    }) => {
    const credentials = { email, password };
  try {
    const { data } = await axiosApi.post("/auth/login", credentials);
    return data;
  } catch (error: any) {
    // Si el error es de Axios, manejar con error.response, de lo contrario, usar el mensaje genérico
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};
export default postLogin;
