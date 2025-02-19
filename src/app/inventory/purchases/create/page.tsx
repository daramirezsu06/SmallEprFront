"use client";
import GetProducts from "@/api/products/get-products";
import GetTypeOfProducts from "@/api/products/type-of-products/get-types-of-products";
import GetSuppliers from "@/api/purchases/get-Suppliers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ItemsList = {
  productId: number;
  quantity: number;
  cost: number;
  movementTypeId: number;
};

const PurchasesForm = () => {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [factura, setFactura] = useState<string>("");
  const [dateBuy, setDateBuy] = useState<string>(new Date().toISOString());
  const [formData, setFormData] = useState<ItemsList[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [TypeOfProducts, setTypeOfProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cost, setCost] = useState<number>(0);

  const fetchSuppliers = async () => {
    try {
      const data = await GetSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    }
  };

  const fetchProducts = async (typeId = 1) => {
    try {
      const data = await GetProducts(typeId);
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  const fetchTypeOfProducts = async () => {
    try {
      const data = await GetTypeOfProducts();
      setTypeOfProducts(data);
    } catch (error) {
      console.error("Error al obtener tipos de productos", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchTypeOfProducts();
  }, []);

  const handleTypeChange = (e: any) => {
    fetchProducts(e.target.value);
  };

  const handleSupplierChange = (e: any) => {
    setSupplierId(Number(e.target.value));
  };

  const handleDateChange = (e: any) => {
    setDateBuy(new Date(e.target.value).toISOString());
  };

  const handleFacturaChange = (e: any) => {
    setFactura(e.target.value);
  };

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0 && cost > 0) {
      setFormData([
        ...formData,
        {
          productId: selectedProduct,
          quantity,
          cost,
          movementTypeId: 2, // Asumo que siempre es 2, puedes cambiarlo si es dinámico
        },
      ]);
      setSelectedProduct(null);
      setQuantity(1);
      setCost(0);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!supplierId || !factura || formData.length === 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const purchaseData = {
      supplierId,
      Factura: Number(factura),
      data: dateBuy,
      CreateInventoryMovementsDto: formData,
    };

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error("Error al registrar la compra");
      }

      const result = await response.json();
      console.log("Compra registrada:", result);
      alert("Compra registrada exitosamente.");
      router.push("/purchases"); // Redirigir a la lista de compras o actualizar el estado
    } catch (error) {
      console.error("Error al enviar la compra:", error);
      alert("Hubo un error al registrar la compra.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Formulario de Compra
      </h1>

      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        {/* Selección de proveedor */}
        <div className="border border-gray-200 pt-4 flex gap-2 flex-wrap justify-center">
          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">
              Proveedor
            </label>
            <select
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              onChange={handleSupplierChange}
              required>
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">Fecha</label>
            <input
              type="date"
              onChange={handleDateChange}
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              required
            />
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">
              Número de Factura
            </label>
            <input
              type="number"
              value={factura}
              onChange={handleFacturaChange}
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              required
            />
          </div>
        </div>

        {/* Selección de Producto */}
        <div className="border border-gray-200 pt-4 flex gap-2 flex-wrap justify-center">
          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">
              Tipo de Producto
            </label>
            <select
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              onChange={handleTypeChange}
              required>
              <option value="">Seleccione un tipo</option>
              {TypeOfProducts.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">
              Producto
            </label>
            <select
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              required>
              <option value="">Seleccione un producto</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">
              Cantidad
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              required
            />
          </div>

          <div className="flex flex-col w-1/3">
            <label className="text-lg font-medium text-gray-600">Costo</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              min="0"
              className="mt-2 p-3 border rounded-lg bg-gray-50"
              required
            />
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={handleAddProduct}
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-blue-600">
            Agregar Item
          </button>
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Enviar Compra
          </button>
        </div>
      </form>
    </div>
  );
};
export default PurchasesForm;
