"use client";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table/tableContainer";
import GetSuppliers from "@/api/purchases/get-Suppliers";
import { SuppliersColumns } from "@/utils/TableColumns/inventories copy";

export default function Page() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await GetSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando proveedores...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Proveedores</h1>
      <Table data={suppliers} columns={SuppliersColumns} />
    </div>
  );
}
