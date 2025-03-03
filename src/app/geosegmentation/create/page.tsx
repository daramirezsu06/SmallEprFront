"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/app/context/authContext";
import GetMunicipalities from "@/api/geoSegmentation/getMunisipalities";
import CreateMunicipality from "@/api/geoSegmentation/CreateMunisipalities";
import CreateNeighborhood from "@/api/geoSegmentation/CreateNeighborhood";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// Interfaces basadas en los DTOs
interface CreateMunicipalityDto {
  name: string;
  lat: number;
  lon: number;
}

interface CreateNeighborhoodDto {
  name: string;
  lat: number;
  lon: number;
  municipalityId: number;
}

interface Municipality {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

// Componente Input definido fuera del componente principal
const Input = ({ label, id, value, onChange, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      value={value} // Asegúrate de pasar el valor controlado
      onChange={onChange} // Asegúrate de pasar el manejador de cambio
      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      {...props}
    />
  </div>
);

export default function CreateGeoSegmentationPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isMunicipality, setIsMunicipality] = useState(true);
  const [municipalityData, setMunicipalityData] =
    useState<CreateMunicipalityDto>({
      name: "",
      lat: 6.2442,
      lon: -75.5812,
    });
  const [neighborhoodData, setNeighborhoodData] =
    useState<CreateNeighborhoodDto>({
      name: "",
      lat: 6.2442,
      lon: -75.5812,
      municipalityId: 0,
    });
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 6.2442,
    lng: -75.5812,
  });
  const [zoom, setZoom] = useState<number>(10);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isMunicipality) {
      GetMunicipalities()
        .then((data) => setMunicipalities(data))
        .catch(() => setError("Error al cargar municipios"));
    }
  }, [user, isMunicipality]);

  useEffect(() => {
    if (isMunicipality) {
      setLocation({ lat: municipalityData.lat, lng: municipalityData.lon });
    } else {
      setLocation({ lat: neighborhoodData.lat, lng: neighborhoodData.lon });
    }
  }, [isMunicipality, municipalityData, neighborhoodData]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setLocation({ lat: newLat, lng: newLng });
      if (isMunicipality) {
        setMunicipalityData((prev) => ({ ...prev, lat: newLat, lon: newLng }));
      } else {
        setNeighborhoodData((prev) => ({ ...prev, lat: newLat, lon: newLng }));
      }
      setZoom(15);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          setZoom(15);
          if (isMunicipality) {
            setMunicipalityData((prev) => ({ ...prev, lat, lon: lng }));
          } else {
            setNeighborhoodData((prev) => ({ ...prev, lat, lon: lng }));
          }
        },
        (err) => {
          setError(
            "No se pudo obtener la ubicación. Ajusta manualmente en el mapa."
          );
          console.error(err);
        }
      );
    } else {
      setError("La geolocalización no es compatible con este navegador.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMunicipality) {
        if (!municipalityData.name) {
          setError("El nombre del municipio es obligatorio");
          return;
        }
        console.log(municipalityData);

        const response = await CreateMunicipality({ municipalityData });
        Swal.fire({
          title: "Municipio creado",
          text: `El municipio ${municipalityData.name} ha sido creado con éxito con el id ${response.id}`,
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => router.push("/"));
      } else {
        if (!neighborhoodData.name) {
          setError("El nombre del barrio es obligatorio");
          return;
        }
        if (!neighborhoodData.municipalityId) {
          setError("Debes seleccionar un municipio");
          return;
        }
        console.log(neighborhoodData);

        const response = await CreateNeighborhood({ neighborhoodData });

        Swal.fire({
          title: "Barrio creado",
          text: `El barrio ${neighborhoodData.name} ha sido creado con éxito con el id ${response.id}`,
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => router.push("/"));
      }
    } catch (err) {
      setError("Error al crear la entidad geográfica");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isMunicipality ? "Crear Municipio" : "Crear Barrio"}
        </h2>

        <div className="mb-6">
          <label className="mr-4">
            <input
              type="radio"
              checked={isMunicipality}
              onChange={() => setIsMunicipality(true)}
              className="mr-2"
            />
            Municipio
          </label>
          <label>
            <input
              type="radio"
              checked={!isMunicipality}
              onChange={() => setIsMunicipality(false)}
              className="mr-2"
            />
            Barrio
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              id="name"
              type="text"
              value={
                isMunicipality ? municipalityData.name : neighborhoodData.name
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                isMunicipality
                  ? setMunicipalityData({
                      ...municipalityData,
                      name: e.target.value,
                    })
                  : setNeighborhoodData({
                      ...neighborhoodData,
                      name: e.target.value,
                    })
              }
              required
            />

            {!isMunicipality && (
              <div>
                <label
                  htmlFor="municipalityId"
                  className="block text-sm font-medium text-gray-700">
                  Municipio
                </label>
                <select
                  id="municipalityId"
                  value={neighborhoodData.municipalityId}
                  onChange={(e) =>
                    setNeighborhoodData({
                      ...neighborhoodData,
                      municipalityId: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required>
                  <option value={0} disabled>
                    Selecciona un municipio
                  </option>
                  {municipalities.map((municipality) => (
                    <option key={municipality.id} value={municipality.id}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación central (haz clic en el mapa para ajustar)
            </label>
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Usar mi ubicación actual
                </button>
                <LoadScript
                  googleMapsApiKey={
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  }>
                  <GoogleMap
                    mapContainerStyle={{ height: "400px", width: "100%" }}
                    center={location}
                    zoom={zoom}
                    onClick={handleMapClick}>
                    <Marker position={location} />
                  </GoogleMap>
                </LoadScript>
              </>
            ) : (
              <div className="text-red-500">
                Error: API Key de Google Maps no configurada
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {isMunicipality ? "Crear Municipio" : "Crear Barrio"}
          </button>
        </form>
      </div>
    </div>
  );
}
