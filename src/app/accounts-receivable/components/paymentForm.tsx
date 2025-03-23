import { useState, useEffect } from "react";
import GetAllPendingSellsByCustomer from "@/api/accountsReceivable/get_all_sells_by_customer";
import CreatePayment from "@/api/payment/createPayment";
import Swal from "sweetalert2";

interface Sell {
  id: number;
  totalPrice: number;
  status: string;
  pendingAmount: number;
}

interface PaymentAllocation {
  sellId: number;
  allocatedAmount: number;
}

const PaymentForm = ({ customerId }: { customerId: number }) => {
  const [sells, setSells] = useState<Sell[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0); // Monto disponible
  const [selectedSells, setSelectedSells] = useState<number[]>([]); // IDs de ventas seleccionadas
  const [allocations, setAllocations] = useState<PaymentAllocation[]>([]); // Asignaciones calculadas

  // Cargar las ventas con saldo pendiente al seleccionar un cliente
  useEffect(() => {
    const fetchSells = async () => {
      const response = await GetAllPendingSellsByCustomer(customerId);
      setSells(response); // Ajustado según la estructura de tu respuesta
    };
    fetchSells();
  }, [customerId]);

  // Actualizar el monto disponible cuando cambia el monto del pago
  useEffect(() => {
    setRemainingAmount(paymentAmount);
    setSelectedSells([]);
    setAllocations([]);
  }, [paymentAmount]);

  // Manejar la selección/deselección de una venta
  const handleSellSelection = (sellId: number) => {
    let updatedSelectedSells: number[];
    const updatedAllocations: PaymentAllocation[] = [];

    if (selectedSells.includes(sellId)) {
      // Deseleccionar la venta
      updatedSelectedSells = selectedSells.filter((id) => id !== sellId);
    } else {
      // Seleccionar la venta si hay monto disponible
      if (remainingAmount <= 0) {
        alert("No hay más monto disponible para asignar.");
        return;
      }
      updatedSelectedSells = [...selectedSells, sellId];
    }

    // Calcular las asignaciones para las ventas seleccionadas
    let tempRemainingAmount = paymentAmount;
    for (const selectedSellId of updatedSelectedSells) {
      const sell = sells.find((s) => s.id === selectedSellId);
      if (sell) {
        const amountToAllocate = Math.min(
          tempRemainingAmount,
          sell.pendingAmount
        );
        updatedAllocations.push({
          sellId: selectedSellId,
          allocatedAmount: amountToAllocate,
        });
        tempRemainingAmount -= amountToAllocate;
      }
    }

    setSelectedSells(updatedSelectedSells);
    setAllocations(updatedAllocations);
    setRemainingAmount(tempRemainingAmount);
  };

  // Enviar el pago al backend
  const handleSubmit = async () => {
    if (allocations.length === 0) {
      alert("Por favor selecciona al menos una venta para asignar el pago.");
      return;
    }

    const totalAllocated = allocations.reduce(
      (sum, alloc) => sum + alloc.allocatedAmount,
      0
    );
    if (totalAllocated > paymentAmount) {
      alert("Error: El monto asignado excede el monto del pago.");
      return;
    }

    const paymentDto = {
      amount: paymentAmount,
      paymentType: "CASH", // Podrías permitir al usuario seleccionar esto
      allocations,
    };

    try {
      await CreatePayment(paymentDto);
      Swal.fire({
        title: "Pago registrado",
        text: `El pago ha sido registrado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setPaymentAmount(0);
      setRemainingAmount(0);
      setSelectedSells([]);
      setAllocations([]);
      const response = await GetAllPendingSellsByCustomer(customerId);
      setSells(response);
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      alert("Error al registrar el pago");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Asignar Pago para Cliente
      </h2>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Monto del Pago:
        </label>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
        />
        <p className="mt-2 text-gray-600">
          Monto Disponible: ${remainingAmount.toLocaleString()}
        </p>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Ventas con Saldo Pendiente
      </h3>
      {sells && sells.length > 0 ? (
        sells.map((sell) => {
          const isSelected = selectedSells.includes(sell.id);
          const allocated =
            allocations.find((alloc) => alloc.sellId === sell.id)
              ?.allocatedAmount || 0;
          return (
            <div
              key={sell.id}
              className="flex items-center p-4 mb-2 border border-gray-200 rounded-lg shadow-sm">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() =>
                  handleSellSelection(sell.id)
                }
                disabled={remainingAmount <= 0 && !isSelected}
                className="mr-4 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-gray-800">Venta #{sell.id}</p>
                <p className="text-gray-600">
                  Total: ${sell.totalPrice.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Saldo Pendiente: ${sell.pendingAmount.toLocaleString()}
                </p>
                {isSelected && allocated > 0 && (
                  <p className="text-green-600">
                    Asignado: ${allocated.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">
          No hay ventas pendientes para este cliente.
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={allocations.length === 0}
        className={`w-full mt-6 py-3 rounded-lg text-white font-medium ${
          allocations.length > 0
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        } transition-colors duration-200`}>
        Registrar Pago
      </button>
    </div>
  );
};

export default PaymentForm;
