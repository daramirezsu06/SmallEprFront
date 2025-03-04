"use client";
import { useState, useEffect } from "react";
import { FormulationColumns } from "@/utils/TableColumns/formulations";
import { Table } from "../../components/Table/tableContainer";
import GetFormulations from "@/api/formulations/get-formulations";

export default function FormulationList() {
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const data = await GetFormulations();
        setFormulations(data);
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
      <Table data={formulations} columns={FormulationColumns} />
    </div>
  );
}
