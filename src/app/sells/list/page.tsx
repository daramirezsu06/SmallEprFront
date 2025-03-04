"use client";
import { useState, useEffect } from "react";
import { Table } from "../../components/Table/tableContainer";
import GetAllSells from "@/api/sells/get_all_sells";
import { SellColumns } from "@/utils/TableColumns/sells";

export default function Page() {
  const [sells, setSells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSells = async () => {
      try {
        const data = await GetAllSells();
        setSells(data);
      } catch (error) {
        console.error("Error fetching sells:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSells();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando ventas...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Ventas</h1>
      <Table data={sells} columns={SellColumns} />
    </div>
  );
}
