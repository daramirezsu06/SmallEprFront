// ModalBill.jsx
import React from "react";

interface ModalBillProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  Bill: string;
  setBill: (bill: string) => void;
}

const ModalBill = ({
  showModal,
  setShowModal,
  Bill,
  setBill,
}: ModalBillProps) => {
  const [tempBill, setTempBill] = React.useState(Bill); // Estado temporal para el número de factura

  // Si el modal no está visible, no renderizamos nada
  if (!showModal) return null;

  // Manejar el guardado del número de factura
  const handleSave = () => {
    setBill(tempBill); // Actualizamos el estado en el componente padre
    setShowModal(false); // Cerramos el modal
  };

  // Manejar el cierre sin guardar
  const handleClose = () => {
    setTempBill(Bill); // Restauramos el valor original
    setShowModal(false); // Cerramos el modal
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Número de Factura
        </h2>

        <div className="flex flex-col mb-4">
          <label htmlFor="bill" className="text-lg font-medium text-gray-600">
            Número de Factura (Opcional)
          </label>
          <input
            type="text"
            id="bill"
            value={tempBill}
            onChange={(e) => setTempBill(e.target.value)}
            className="mt-2 p-3 border rounded-lg bg-gray-50"
            placeholder="Ingrese el número de factura"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalBill;
