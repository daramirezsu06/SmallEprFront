"use client";
import { useState, useEffect } from "react";
import { Table } from "../../components/Table/tableContainer";
import {
  CreateProductionDto,
  ProductionItemDto,
  ProductionOrder,
} from "../types"; // Asegúrate de tener los tipos
import GetProductionsOrders from "@/api/production-orders/get-productions-orders";
import CreateProduction from "@/api/productions/create-production";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
// API para obtener y actualizar órdenes de producción

export default function ProductionOrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(
    null
  );
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [adjustments, setAdjustments] = useState<Record<number, number>>({});

  useEffect(() => {
    // Obtener las órdenes pendientes
    const fetchOrders = async () => {
      try {
        const data = await GetProductionsOrders();
        setOrders(data.filter((order) => order.pending)); // Solo mostrar órdenes pendientes
      } catch (error) {
        console.error("Error al obtener órdenes de producción", error);
      }
    };

    fetchOrders();
  }, []);

  // Función para ajustar la cantidad de cada ítem
  const handleAdjustmentChange = (itemId: number, value: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  // Función para guardar los cambios en la producción
  const handleFinalizeOrder = async () => {
    if (selectedOrder) {
      const updatedItems: ProductionItemDto[] =
        selectedOrder.productionOrderItems.map((item) => ({
          productId: item.product.id,
          quantity: adjustments[item.id] || item.quantity, // Si no se ajusta, tomar la cantidad original
        }));

      const productionData: CreateProductionDto = {
        quantity: newQuantity,
        productionOrderId: selectedOrder.id,
        productionItems: updatedItems,
      };

      try {
        const response = await CreateProduction(productionData);
        Swal.fire({
          title: "Producto creado",
          text: `El producto ${response.name} ha sido creado correctamente.`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        router.push("/productions/list");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Hubo un problema al crear la fórmula. Por favor, intenta nuevamente. ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const columns = [
    { name: "Id", selector: "id" },
    { name: "Producto", selector: (row: ProductionOrder) => row.product.name },
    { name: "Cantidad Original", selector: "quantity" },
    { name: "Fecha de Creación", selector: "createDate" },
    {
      name: "Acciones",
      selector: (row: ProductionOrder) => (
        <button
          onClick={() => {
            setSelectedOrder(row);
            setNewQuantity(+row.quantity);
          }}
          className="text-blue-600 hover:text-blue-800">
          Seleccionar
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1>Órdenes de Producción Pendientes</h1>
      <Table data={orders} columns={columns} />

      {/* Ajustes de la orden seleccionada */}
      {selectedOrder && (
        <div className="mt-8 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold">Ajustar Orden de Producción</h2>
          <div className="mt-4">
            <p>
              <strong>Producto Final:</strong> {selectedOrder.product.name}
            </p>
            <p>
              <strong>Formulación:</strong> {selectedOrder.formulations.name}
            </p>
            <div className="mt-4">
              <label className="block font-semibold">Cantidad Resultante</label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="mt-2 p-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>

            <h3 className="mt-4 font-semibold">Ajustar Productos Utilizados</h3>
            {selectedOrder.productionOrderItems.map((item) => (
              <div key={item.id} className="mt-2">
                <div>
                  <strong>{item.product.name}</strong> ({item.product.unit.name}
                  )
                </div>
                <div>
                  <label>Cantidad Utilizada: </label>
                  <input
                    type="number"
                    value={adjustments[item.id] || item.quantity}
                    onChange={(e) =>
                      handleAdjustmentChange(item.id, Number(e.target.value))
                    }
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleFinalizeOrder}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Finalizar Orden de Producción
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
