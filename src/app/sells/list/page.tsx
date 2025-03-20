"use client";
import { useState, useEffect } from "react";
import { Table } from "../../components/Table/tableContainer";
import GetAllSells from "@/api/sells/get_all_sells";
import { SellColumns } from "@/utils/TableColumns/sells";
import Link from "next/link";

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
  const columns = [
    ...SellColumns,
    {
      name: "ver detalles",
      selector: (row: any) => (
        <Link href={`/sells/list/${row.id}`}>
          <button className="text-blue-600 hover:text-blue-800">
            ver detalles
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1>Ventas</h1>
      <Table data={sells} columns={columns} />
    </div>
  );
}
