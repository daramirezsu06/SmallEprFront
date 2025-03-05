"use client";
import { useState, useEffect } from "react";
import { ProductionOrderColumns } from "@/utils/TableColumns/productionsOrders";
import { Table } from "../../components/Table/tableContainer";
import GetProductionsOrders from "@/api/production-orders/get-productions-orders";

export default function Page() {
  const [productionOrders, setProductionOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductionOrders = async () => {
      try {
        const data = await GetProductionsOrders();
        setProductionOrders(data);
      } catch (error) {
        console.error("Error fetching production orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionOrders();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando órdenes de producción...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Órdenes de Producción</h1>
      <Table data={productionOrders} columns={ProductionOrderColumns} />
    </div>
  );
}
