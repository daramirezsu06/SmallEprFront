"use client"; // Asegúrate de importar el componente SelectInput
import { useState } from "react";
import SelectInput from "./selectInput"; // Asegúrate de importar el componente SelectInput
import CreateProducts from "@/api/products/create-product";

type ProductFormProps = {
  units: { id: number; name: string }[];
  productTypes: {
    id: number;
    name: string;
    subTypeProduct: { id: number; name: string }[];
  }[];
};

const ProductForm = ({ units, productTypes }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unitId: "", // Inicializamos con cadena vacía
    typeProductId: "", // Inicializamos con cadena vacía
    subTypeProductId: "", // Inicializamos con cadena vacía
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Si el valor es numérico, lo convertimos a número. Si no, lo dejamos como string
    const newValue = value
      ? isNaN(Number(value))
        ? value
        : Number(value)
      : "";

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name,
      description: formData.description,
      unitId: +formData.unitId,
      typeProductId: +formData.typeProductId,
      subTypeProductId: +formData.subTypeProductId,
    };

    try {
      // Llamamos a CreateProducts pasando los datos del formulario
      const response = await CreateProducts(dataToSend);
      console.log("Producto creado con éxito:", response);
      // Aquí podrías hacer algo más, como redirigir o mostrar un mensaje de éxito
    } catch (error: any) {
      console.error("Error al crear producto:", error.message);
      // Aquí podrías mostrar un mensaje de error al usuario si algo sale mal
    }
  };

  const selectedType = productTypes.find(
    (type) => type.id === Number(formData.typeProductId)
  );

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-md">
      <h2 className="text-3xl font-semibold mb-6">Crear Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-gray-700">Descripción</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <SelectInput
          label="Unidad"
          value={formData.unitId}
          onChange={handleChange}
          options={units}
          name="unitId" // Aseguramos de pasar el name aquí
        />

        <SelectInput
          label="Tipo de Producto"
          value={formData.typeProductId}
          onChange={handleChange}
          options={productTypes.map((type) => ({
            id: type.id,
            name: type.name,
          }))}
          name="typeProductId" // Aseguramos de pasar el name aquí
        />

        {selectedType && formData.typeProductId && (
          <SelectInput
            label="Subtipo de Producto"
            value={formData.subTypeProductId}
            onChange={handleChange}
            options={selectedType.subTypeProduct.map((subtype) => ({
              id: subtype.id,
              name: subtype.name,
            }))}
            name="subTypeProductId" // Aseguramos de pasar el name aquí
          />
        )}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
