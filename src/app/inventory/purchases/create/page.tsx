"use client";
import GetProducts from "@/api/products/get-products";
import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";
import CreatePurchase from "@/api/purchases/create-purchase";
import GetSuppliers from "@/api/purchases/get-Suppliers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Tipado más estricto
interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  unit: {
    acronyms: string;
  };
}

export interface TypeOfProduct {
  id: number;
  name: string;
}

interface Item {
  productId: number;
  productName: string; // Guardamos el nombre para evitar búsquedas
  quantity: number | string;
  cost: number | string;
  movementTypeId: number;
}

const PurchasesForm = () => {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [factura, setFactura] = useState<string>("");
  const [dateBuy, setDateBuy] = useState<string>(
    new Date().toISOString().split("T")[0] // Formato YYYY-MM-DD
  );
  const [formData, setFormData] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [typeOfProducts, setTypeOfProducts] = useState<TypeOfProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string | number>(1);
  const [cost, setCost] = useState<string | number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [suppliersData, productsData, typesData] = await Promise.all([
        GetSuppliers(),
        GetProducts(1),
        GetTypeOfProducts(),
      ]);
      setSuppliers(suppliersData);
      setProducts(productsData);
      setTypeOfProducts(typesData);
    } catch (error) {
      setError("Error al cargar los datos iniciales.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = Number(e.target.value);
    setLoading(true);
    try {
      const data = await GetProducts(typeId);
      setProducts(data);
    } catch (error) {
      setError("Error al cargar productos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Si el valor está vacío, lo dejamos como cadena vacía
    if (value === "") {
      setQuantity("");
    } else {
      // Convertimos a número solo si hay un valor válido
      setQuantity(Number(value));
    }
  };
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Si el valor está vacío, lo dejamos como cadena vacía
    if (value === "") {
      setCost("");
    } else {
      // Convertimos a número solo si hay un valor válido
      setCost(Number(value));
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct && quantity !== "" && cost !== "") {
      const product = products.find((p) => p.id === selectedProduct);
      if (product) {
        setFormData([
          ...formData,
          {
            productId: selectedProduct,
            productName: product.name,
            quantity,
            cost,
            movementTypeId: 2,
          },
        ]);
        setSelectedProduct(null);
        setQuantity(1);
        setCost(0);
      }
    }
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !factura || formData.length === 0) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);
    const purchaseData = {
      supplierId,
      Factura: Number(factura),
      data: dateBuy,
      CreateInventoryMovementsDto: formData.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        cost: item.cost,
        movementTypeId: 2,
      })),
    };

    try {
      const response = await CreatePurchase(purchaseData);
      
      Swal.fire({
        title: "Compra creada",
        text: `La compra de la factura ${response.Factura} ha sido ingresada con el número de referencia ${response.id}. ¿Qué deseas hacer?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Ir a movimientos",
        cancelButtonText: "Continuar ingresando",
        reverseButtons: true, // Opcional: invierte el orden de los botones
        customClass: {
          confirmButton: "bg-blue-500 hover:bg-blue-600",
          cancelButton: "bg-orange-500 hover:bg-orange-600",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario elige "Ir a movimientos"
          router.push("./list");
        } else if (result.isDismissed) {
          // Si el usuario elige "Continuar ingresando", puedes resetear el formulario si lo deseas
          setSupplierId(null); // Opcional: resetear campos
          setFactura(""); // Opcional: resetear campos
          setFormData([]); // Opcional: resetear campos
          setDateBuy(new Date().toISOString().split("T")[0]); // Opcional: resetear fecha
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Hubo un error al crear la compra. Por favor, intenta nuevamente. ${error}`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Formulario de Compra
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && <p className="text-center text-gray-600">Cargando...</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de encabezado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor
            </label>
            <select
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              onChange={(e) => setSupplierId(Number(e.target.value))}
              required>
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              value={dateBuy}
              onChange={(e) => setDateBuy(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Factura
            </label>
            <input
              type="number"
              value={factura}
              onChange={(e) => setFactura(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              required
            />
          </div>
        </div>

        {/* Sección de ítems */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Producto
            </label>
            <select
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
              onChange={handleTypeChange}>
              <option value="">Seleccione un tipo</option>
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
            <div className="flex items-center gap-2">
              <select
                className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                value={selectedProduct || ""}>
                <option value="">Seleccione un producto</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
              <p>
                {"("}
                {products.find((p) => p.id === selectedProduct)?.unit.acronyms}
                {")"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Costo
            </label>
            <input
              type="number"
              value={cost}
              onChange={handleCostChange}
              min="0"
              className="mt-1 p-2 w-full border rounded-lg bg-gray-50"
            />
          </div>
        </div>

        {/* Lista de ítems */}
        {formData.length > 0 && (
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Ítems Agregados
            </h3>
            <div className="space-y-2">
              {formData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p>
                      <strong>Producto:</strong> {item.productName}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Costo:</strong> ${item.cost}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleAddProduct}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Agregar Item
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
            {loading ? "Enviando..." : "Enviar Compra"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchasesForm;
