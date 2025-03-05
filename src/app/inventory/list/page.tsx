"use client";
import { useState, useEffect } from "react";
import { InventoryColumns } from "@/utils/TableColumns/inventories";
import { Table } from "../../components/Table/tableContainer";
import GetInventories from "@/api/inventory/get-inventories";

export default function Page() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const data = await GetInventories();
        setInventories(data);
      } catch (error) {
        console.error("Error fetching inventories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando inventarios...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Inventarios</h1>
      <Table data={inventories} columns={InventoryColumns} />
    </div>
  );
}
