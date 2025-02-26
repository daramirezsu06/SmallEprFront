// components/CreateCustomer.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import GetSellers from "@/api/sellers/get-sellers";
import { useAuth } from "@/app/context/authContext";
import GetPriceList from "@/api/customers/get_PriceList";
import GetCustomersTypes from "@/api/customers/get_customerType";
import CreateCustomer from "@/api/customers/CreateCustomer";
import GetMunicipalities from "@/api/geoSegmentation/getMunisipalities";

// Tipos basados en tu DTO
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

// Suponiendo que estas funciones existen y devuelven listas
interface Seller {
  id: number;
  name: string;
}
interface CustomerType {
  id: number;
  name: string;
}
interface PriceList {
  id: number;
  name: string;
}
interface Neighborhood {
  id: number;
  name: string;
  lat: number;
  lon: number;
}
interface Municipality {
  id: number;
  name: string;
  lat: number;
  lon: number;
  neighborhoods: Neighborhood[];
}

export default function CreateCustomerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCustomerDto>({
    name: "",
    address: "",
    customerTypeId: 0,
  });
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 4.60971,
    lng: -74.08175,
  }); // Bogotá por defecto
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.role !== "Vendedor") {
      router.push("/dashboard"); // Solo vendedores pueden crear clientes
    } else {
      // Cargar listas
      Promise.all([GetSellers(), GetCustomersTypes(), GetPriceList(), GetMunicipalities()])
        .then(([sellersData, typesData, pricesData, municipalitiesData]) => {
          setSellers(sellersData);
          setCustomerTypes(typesData);
          setPriceLists(pricesData);
          setMunicipalities(municipalitiesData);
          // Preseleccionar el vendedor actual si está en la lista
          if (user)
            setFormData((prev) => ({
              ...prev,
              sellerId: user.sellerId || sellersData[0]?.id,
            }));
        })
        .catch(() => setError("Error al cargar datos"));
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      lat: location.lat,
      lon: location.lng,
      sellerId: user?.sellerId || formData.sellerId,
    });
    try {
      const dataToSend = {
        ...formData,
        lat: location.lat,
        lon: location.lng,
        sellerId: user?.sellerId || formData.sellerId, // Usa el ID del vendedor autenticado si aplica
      };
      await CreateCustomer({ customerData: dataToSend });
      router.push("/customers"); // Redirige a la lista de clientes tras éxito
    } catch (err) {
      setError("Error al crear el cliente");
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="nit"
                className="block text-sm font-medium text-gray-700">
                NIT (Opcional)
              </label>
              <input
                id="nit"
                type="text"
                value={formData.nit || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nit: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="tel"
                className="block text-sm font-medium text-gray-700">
                Teléfono (Opcional)
              </label>
              <input
                id="tel"
                type="text"
                value={formData.tel || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tel: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="customerTypeId"
                className="block text-sm font-medium text-gray-700">
                Tipo de Cliente
              </label>
              <select
                id="customerTypeId"
                value={formData.customerTypeId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerTypeId: Number(e.target.value),
                  })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required>
                <option value={0} disabled>
                  Selecciona un tipo
                </option>
                {customerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="priceListId"
                className="block text-sm font-medium text-gray-700">
                Lista de Precios (Opcional)
              </label>
              <select
                id="priceListId"
                value={formData.priceListId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceListId: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Sin lista</option>
                {priceLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
            {/* // vendedor */}
            <div>
              <label
                htmlFor="priceListId"
                className="block text-sm font-medium text-gray-700">
                vendedor asignado (Opcional)
              </label>
              <select
                id="sellerId"
                value={formData.sellerId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellerId: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Sin lista</option>
                {sellers.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mapa de Google */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación (haz clic en el mapa)
            </label>
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
              <GoogleMap
                mapContainerStyle={{ height: "400px", width: "100%" }}
                center={location}
                zoom={13}
                onClick={handleMapClick}>
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
}
