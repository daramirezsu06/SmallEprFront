"use client";
import { useState, useEffect } from "react";
import { Table } from "../../../components/Table/tableContainer";
import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";
import { ProductTypeColumns } from "@/utils/TableColumns/productType";

export default function Page() {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await GetTypeOfProducts();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductTypes();
  }, []); // Se ejecuta solo al montar la página

  if (loading) {
    return <div>Cargando tipos de productos...</div>; // Mensaje mientras se cargan los datos
  }

  return (
    <div>
      <h1>Tipos de Productos</h1>
      <Table data={productTypes} columns={ProductTypeColumns} />
    </div>
  );
}
