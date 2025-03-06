"use client";
import { useState, useEffect } from "react";

import { Table } from "../../components/Table/tableContainer";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import { CustomerColumns } from "@/utils/TableColumns/customers";
import GetCustomers from "@/api/customers/get-customers";
// import { ICustomer } from "@/interfaces/customer";

export default function CustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const data = await GetCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching formulations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulations();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando formulaciones...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Formulations</h1>
      <Table data={customers} columns={CustomerColumns} />


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación central (haz clic en el mapa para ajustar)
        </label>
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <>
            {/* <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Usar mi ubicación actual
            </button> */}
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ height: "400px", width: "100%" }}
                center={ 
                   { lat: 6.2442, lng: -75.5812 }
                }
                zoom={14}>
                {customers.map((customer) => (
                  <Marker
                    key={customer.id}
                    position={{ lat: customer.lat, lng: customer.lon }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </>
        ) : (
          <div className="text-red-500">
            Error: API Key de Google Maps no configurada
          </div>
        )}
      </div>
    </div>
  );
}
