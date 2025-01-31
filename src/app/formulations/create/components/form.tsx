"use client";
import { useState } from "react";
import CreateFormulations from "@/api/formulations/create-formulation";
import SelectInput from "@/app/products/create/components/selectInput";
import { Product } from "@/api/products/product.type";

const FormulationForm = ({ products }: { products: Product[] }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productId: "",
    quantity: 0,
    items: [] as { productId: number; quantity: number }[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: 0, quantity: 0 }, // Agregar un item vacío por defecto
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = value
      ? isNaN(Number(value))
        ? value
        : Number(value)
      : "";

    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: newValue };

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Llamar a CreateFormulation pasando los datos del formulario
      const response = await CreateFormulations({ formulationsData: formData });
      console.log("Fórmula creada con éxito:", response);
      // Aquí puedes manejar la respuesta, redirigir, o mostrar un mensaje de éxito.
    } catch (error: any) {
      console.error("Error al crear fórmula:", error.message);
      // Aquí puedes manejar el error, como mostrar un mensaje al usuario.
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-md">
      <h2 className="text-3xl font-semibold mb-6">Crear Fórmula</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la fórmula */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-gray-700">
            Nombre de la Fórmula
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Descripción de la fórmula */}
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

        {/* Producto base */}
        <SelectInput
          label="Producto Base"
          value={formData.productId}
          onChange={handleChange}
          options={products.map((product) => ({
            id: product.id,
            name: product.name,
          }))}
          name="productId"
        />

        {/* Cantidad del producto base */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-gray-700">
            Cantidad del Producto Base
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Items de la fórmula */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Productos de la Fórmula
          </h3>
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-col space-y-3 mb-4">
              <SelectInput
                label={`Producto ${index + 1}`}
                value={item.productId}
                onChange={(e) => handleItemChange(index, e)}
                options={products.map((product) => ({
                  id: product.id,
                  name: product.name,
                }))}
                name="productId"
              />

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-gray-700">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 hover:text-red-700">
                Eliminar Item
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
            Agregar Item
          </button>
        </div>

        {/* Botón para crear la fórmula */}
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
          Crear Fórmula
        </button>
      </form>
    </div>
  );
};

export default FormulationForm;
