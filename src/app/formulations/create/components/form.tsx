"use client";
import { useEffect, useState } from "react";
import CreateFormulations from "@/api/formulations/create-formulation";
import { Product } from "@/api/products/product.type";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GetProducts from "@/api/products/get-products";
import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";

interface TypeOfProduct {
  id: number;
  name: string;
}

interface FormulationItem {
  productId: number | string;
  quantity: number | string;
}

const FormulationForm = () => {
  const router = useRouter();

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productId: "",
    quantity: "",
  });

  // Estados para datos dinámicos
  const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [baseProducts, setBaseProducts] = useState<Product[]>([]); // Productos para el "Producto Base"
  const [itemProducts, setItemProducts] = useState<Product[]>([]); // Productos para los ítems
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para los ítems agregados
  const [items, setItems] = useState<FormulationItem[]>([]);

  // Estado para el ítem actual que se está ingresando
  const [currentItem, setCurrentItem] = useState<FormulationItem>({
    productId: "",
    quantity: "",
  });

  // Carga inicial de datos
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allProducts, typesData] = await Promise.all([
        GetProducts(), // Todos los productos sin filtro inicial
        GetTypeOfProducts(),
      ]);
      // Filtrar productos base con typeProduct.id igual a 3 o 4
      setBaseProducts(
        allProducts.filter(
          (p: any) => p.typeProduct.id === 3 || p.typeProduct.id === 4
        )
      );
      setItemProducts(allProducts); // Lista inicial para ítems (sin filtro)
      setTypeOfProducts(typesData);
    } catch (err) {
      setError("Error al cargar los datos iniciales.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejo de cambios en los campos principales
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue =
      value === "" ? "" : isNaN(Number(value)) ? value : Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Manejo de cambios en los campos del ítem actual
  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue =
      value === "" ? "" : isNaN(Number(value)) ? value : Number(value);
    setCurrentItem((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Filtro por tipo de producto (solo afecta a los ítems)
  const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = Number(e.target.value) || null;
    setSelectedTypeId(typeId);
    setCurrentItem((prev) => ({ ...prev, productId: "" })); // Resetear producto del ítem actual
    setLoading(true);
    setError(null);
    try {
      const data = typeId ? await GetProducts(typeId) : baseProducts; // Si no hay tipo, usar todos los productos
      setItemProducts(data); // Actualizar solo los productos de los ítems
    } catch (err) {
      setError("Error al cargar productos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (currentItem.productId && currentItem.quantity) {
      setItems([...items, { ...currentItem }]);
      setCurrentItem({ productId: "", quantity: "" }); // Reseteamos el ítem actual
    } else {
      Swal.fire({
        title: "Error",
        text: "Selecciona un producto y una cantidad.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productId || !formData.quantity) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos principales son obligatorios.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    setLoading(true);
    setError(null);
    const dataToSend = {
      name: formData.name,
      description: formData.description,
      productId: formData.productId,
      quantity: Number(formData.quantity),
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    };

    try {
      const response = await CreateFormulations({
        formulationsData: dataToSend,
      });
      Swal.fire({
        title: "Fórmula creada",
        text: `La fórmula ${response.name} ha sido creada correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {
        router.push("/formulations/list");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: `Hubo un problema al crear la fórmula. Por favor, intenta nuevamente. ${err}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Crear Fórmula
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {loading && <p className="text-center text-gray-600">Cargando...</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Fórmula
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producto Base
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              required
              disabled={loading}>
              <option value="">Seleccione un producto</option>
              {baseProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <p>{baseProducts.find((p) => p.id === Number(formData.productId))?.unit.acronyms}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad del Producto Base
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Sección para agregar ítems */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Producto
            </label>
            <select
              value={selectedTypeId || ""}
              onChange={handleTypeChange}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              disabled={loading}>
              <option value="">Todos los tipos</option>
              {typeOfProducts.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producto
            </label>
            <select
              name="productId"
              value={currentItem.productId}
              onChange={handleItemChange}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              disabled={loading}>
              <option value="">Seleccione un producto</option>
              {itemProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              value={currentItem.quantity}
              onChange={handleItemChange}
              min="0"
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              disabled={loading}
            />
          </div>
        </div>

        {/* Botón para agregar el ítem */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading}>
            Agregar Item
          </button>
        </div>

        {/* Lista de ítems agregados */}
        {items.length > 0 && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Productos de la Fórmula
            </h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p>
                      <strong>Producto:</strong>{" "}
                      {itemProducts.find((p) => p.id === Number(item.productId))
                        ?.name || "Desconocido"}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                    disabled={loading}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón para enviar el formulario */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}>
            {loading ? "Creando..." : "Crear Fórmula"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormulationForm;
