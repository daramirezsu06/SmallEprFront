"use client";
import { useState, useEffect } from "react";
import { Table } from "../../components/Table/tableContainer";
import GetInventorieMovements from "@/api/inventory/get-inventorie-movements";
import { InventoryMovementsColumns } from "@/utils/TableColumns/inventorieMovements";

export default function Page() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await GetInventorieMovements();
        setMovements(data);
      } catch (error) {
        console.error("Error fetching inventory movements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando movimientos de inventario...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Movimientos de Inventario</h1>
      <Table data={movements} columns={InventoryMovementsColumns} />
    </div>
  );
}
