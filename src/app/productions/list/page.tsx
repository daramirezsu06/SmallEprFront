"use client";
import { useState, useEffect } from "react";
import { ProductionColumns } from "@/utils/TableColumns/productions";
import { Table } from "../../components/Table/tableContainer";
import GetProductions from "@/api/productions/get-productions";

export default function Page() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const data = await GetProductions();
        setProductions(data);
      } catch (error) {
        console.error("Error fetching productions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductions();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando producciones...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Producciones</h1>
      <Table data={productions} columns={ProductionColumns} />
    </div>
  );
}
