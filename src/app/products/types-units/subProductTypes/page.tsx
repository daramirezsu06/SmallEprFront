"use client";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table/tableContainer";
import GetSubTypeOfProducts from "@/api/products/type-of-products/get-sub-types-of-products";
import { SubProductTypeColumns } from "@/utils/TableColumns/subProductType";

export default function Page() {
  const [subProductTypes, setSubProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubProductTypes = async () => {
      try {
        const data = await GetSubTypeOfProducts();
        setSubProductTypes(data);
      } catch (error) {
        console.error("Error fetching sub-product types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubProductTypes();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando subtipos de productos...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Subtipos de Productos</h1>
      <Table data={subProductTypes} columns={SubProductTypeColumns} />
    </div>
  );
}
