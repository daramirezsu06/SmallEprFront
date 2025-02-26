import { axiosApi } from "../api";

const GetNeighborhoods = async () => {
  try {
    const { data } = await axiosApi.get("/geo-segmentation/neighborhood");
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};

export default GetNeighborhoods;
