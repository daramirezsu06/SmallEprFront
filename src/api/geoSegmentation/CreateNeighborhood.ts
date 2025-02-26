import { axiosApi } from "../api";

type NeighborhoodData = {
  name: string;
  unicipalityId: string;
  lat: number;
  lon: number;
};

const CreateNeighborhood = async ({
  neighborhoodData,
}: {
  neighborhoodData: NeighborhoodData;
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
