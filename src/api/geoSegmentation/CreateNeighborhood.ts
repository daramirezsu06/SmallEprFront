import { CreateNeighborhoodDto } from "@/app/geosegmentation/create/page";
import { axiosApi } from "../api";


const CreateNeighborhood = async ({
  neighborhoodData,
}: {
  neighborhoodData: CreateNeighborhoodDto;
}) => {
  try {
    const { data } = await axiosApi.post(
      "/geo-segmentation/neighborhood",
      neighborhoodData
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};

export default CreateNeighborhood;
