"use client";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table/tableContainer";
import GetUnits from "@/api/products/units/get-units";
import { UnitColumns } from "@/utils/TableColumns/units";

export default function Page() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await GetUnits();
        setUnits(data);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando unidades...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Unidades</h1>
      <Table data={units} columns={UnitColumns} />
    </div>
  );
}
