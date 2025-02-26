import { axiosApi } from "../api";

type MunicipalityData = {
  name: string;
  lat: number;
  lon: number;
};

const CreateMunicipality = async ({
  municipalityData,
}: {
  municipalityData: MunicipalityData;
}) => {
  try {
    const { data } = await axiosApi.post(
      "/geo-segmentation/municipality",
      municipalityData
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message); // Usar `new Error` para seguir las buenas prácticas
  }
};

export default CreateMunicipality;
