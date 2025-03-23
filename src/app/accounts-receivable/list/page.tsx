"use client";
import { useState, useEffect } from "react";

import { Table } from "../../components/Table/tableContainer";
import GetAllPendingSells from "@/api/accountsReceivable/get_all_sells";
import { PendingSellColumns } from "@/utils/TableColumns/pendingSells";

export interface PendingSell {
  id: number;
  totalPrice: string;
  status: string;
  pendingAmount: number;
  createDate: string;
  customer: { name: string };
}

export default function FormulationList() {
  const [pendingSells, setPendingSells] = useState<PendingSell[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const data = await GetAllPendingSells();
        setPendingSells(data.pendingList);
        setTotalPending(data.totalPending);
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
      <h1>Formulations</h1> <h1>Valor total Cartera {totalPending}</h1>
      <Table data={pendingSells} columns={PendingSellColumns} />
    </div>
  );
}
