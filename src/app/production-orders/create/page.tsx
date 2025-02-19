"use client";
import { useEffect, useState } from "react";
import { Table } from "../../components/Table/tableContainer";
import { FormulationColumns } from "@/utils/TableColumns/formulations";
import GetFormulations from "@/api/formulations/get-formulations";
import CreateProductionOrder from "@/api/production-orders/create-production-orders"; // Servicio para crear la orden de producción
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { generateProductionOrderPDF } from "@/utils/pdfs/productionOrderPdf";


interface Formulation {
  id: number;
  name: string;
  cuantity: number;
  createDate: string;
  product: { name: string };
}

export default function FormulationList() {
  const router = useRouter();
  const [formulations, setFormulations] = useState<Formulation[]>([]);
  const [selectedFormulation, setSelectedFormulation] =
    useState<Formulation | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const fetchFormulations = async () => {
    try {
      const data = await GetFormulations();
      setFormulations(data);
    } catch (error) {
      console.error("Error al obtener formulaciones", error);
    }
  };

  // Llamada para crear una nueva orden de producción
  const handleCreateOrder = async () => {
    if (selectedFormulation && quantity > 0) {
      try {
        const orderData = {
          formulationId: selectedFormulation.id,
          quantity,
        };
        const response = await CreateProductionOrder(orderData);
        Swal.fire({
          title: "Producto creado",
          text: `El producto ${response.name} ha sido creado correctamente.`,
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          generateProductionOrderPDF(response);
        });

        router.push("/production-orders/list");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `Hubo un problema al crear la fórmula. Por favor, intenta nuevamente. ${error}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } else {
      alert("Por favor, selecciona una formulación y una cantidad válida.");
    }
  };

  // Cargar formulaciones al montar el componente
  useEffect(() => {
    fetchFormulations();
  }, []);

  // Agregar un botón para crear la orden
  const columns = [
    ...FormulationColumns,
    {
      name: "Acciones",
      selector: (row: Formulation) => (
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setSelectedFormulation(row)}>
          Seleccionar
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1>Formulaciones</h1>
      <Table data={formulations} columns={columns} />

      {/* Mostrar el formulario para crear la orden de producción si hay una formulación seleccionada */}
      {selectedFormulation && (
        <div className="mt-8 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold">Crear Orden de Producción</h2>
          <div className="mt-4">
            <p>
              <strong>Formulación Seleccionada:</strong>{" "}
              {selectedFormulation.name}
            </p>
            <p>
              <strong>Producto:</strong> {selectedFormulation.product.name}
            </p>
            <div className="mt-4">
              <label className="block font-semibold">Cantidad a Producir</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 p-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>
            <button
              onClick={handleCreateOrder}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Crear Orden de Producción
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
