"use client";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table/tableContainer";
import GetPurchases from "@/api/purchases/get-purchases";
import { PurchaseColumns } from "@/utils/TableColumns/purchases";

export default function Page() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await GetPurchases();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando inventarios...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Inventarios</h1>
      <Table data={purchases} columns={PurchaseColumns} />
    </div>
  );
}
