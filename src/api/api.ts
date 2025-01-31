import axios from "axios";
import { baseURL } from "./env";

export const axiosApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosApi.interceptors.request.use(
//   async (config) => {
//     const session = await getServerSession(); // Obtiene el token
//     const token = session?.token;
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     console.log('Token obtenido:', token);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
