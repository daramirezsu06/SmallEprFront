"use client";
import { useState, useEffect } from "react";

import GetProducts from "@/api/products/get-products";
import CreateInventorieMovements from "@/api/inventory/create-inventorie-movements copy";
import Swal from "sweetalert2";

export default function PurchaseForm() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    quantity: "",
    cost: "",
    productId: "",
    movementTypeId: 2,
  });

  const fetchProducts = async () => {
    const response = await GetProducts();
    setProducts(response);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const dataToSend = {
      cost: +form.cost,
      quantity: +form.quantity,
      productId: +form.productId,
      movementTypeId: 2,
    };
    e.preventDefault();
    try {
      const response = await CreateInventorieMovements(dataToSend);
      Swal.fire({
        title: "Compra registrada",
        text: `La compra de ${form.quantity} unidades de ${
          form.productId
        } con costo ${form.cost} ha sido registrada con éxito con el id ${response.id}`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      
    } catch (error: any) {
      console.error("Error al registrar compra:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar Compra</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="productId" value={form.productId} onChange={handleChange}>
          <option>
            {form.productId
              ? products.find((p) => p.id === Number(form.productId))?.name
              : "Selecciona un producto"}
          </option>

          {products.map((product) => (
            <option key={product.id} value={String(product.id)}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cost"
          placeholder="Costo unitario"
          value={form.cost}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar Compra</button>
      </form>
    </div>
  );
}
