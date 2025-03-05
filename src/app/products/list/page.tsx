"use client";
import { useState, useEffect } from "react";
import GetProducts from "@/api/products/get-products";
import { Table } from "../../components/Table/tableContainer";
import { Productcolumns } from "@/utils/TableColumns/product";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos cuando la página se monte
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await GetProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // El array vacío asegura que se ejecute solo al montar la página

  if (loading) {
    return <div>Cargando productos...</div>; // Puedes personalizar este mensaje
  }

  return (
    <div>
      <Table data={products} columns={Productcolumns} />
    </div>
  );
}
