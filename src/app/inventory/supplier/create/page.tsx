"use client";
import CreateSupplier from "@/api/purchases/create-supplier";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

interface SupplierFormData {
  name: string;
  address: string;
  NIT: string;
  tel: string;
}

const SupplierForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    address: "",
    NIT: "",
    tel: "",
  });

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "NIT", name: "NIT", type: "text" },
    { label: "Phone Number", name: "tel", type: "text" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createSupplier = async () => {
    console.log("Supplier data:", formData);

    try {
      const data = await CreateSupplier(formData);
      // Mostrar alerta de éxito
      Swal.fire({
        title: "¡Proveedor creado!",
        text: `El proveedor ${data.name} ha sido creado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      router.push("/inventory/supplier/list");
    } catch (error) {
      // Si hay algún error en la creación, mostrar alerta de error
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el proveedor. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Supplier data:", formData);
    createSupplier();
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Supplier
        </h2>
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof SupplierFormData]}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;
