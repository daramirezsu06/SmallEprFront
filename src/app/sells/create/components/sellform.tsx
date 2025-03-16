"use client";

import GetCustomers from "@/api/customers/get-customers";
import GetProducts from "@/api/products/get-products";
import CreateSell from "@/api/sells/createSell";
import { useAuth } from "@/app/context/authContext";
import { generateSalePDF } from "@/utils/pdfs/remisionPdf";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ItemsList {
  productId: number;
  quantity: number;
  price: number;
}

const SellForm = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);
  // const [statusPaid, setStatusPaid] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [listPrice, setListPrice] = useState<any[]>([]);
  const [temsList, setItemsList] = useState<ItemsList[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);

  const { user } = useAuth();

  // Función para obtener los clientes desde la API
  const getCustomers = async () => {
    setLoading(true);
    try {
      const responseCustomers = await GetCustomers();
      setCustomers(responseCustomers); // Actualiza el estado con los clientes
    } catch (err: any) {
      setError("Error al obtener los clientes" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const responseProducts = await GetProducts(4);
      setProducts(responseProducts);
    } catch (err: any) {
      setError("Error al obtener los productos" + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
    getProducts();
  }, []);

  const handleCustomerChange = (id: number) => {
    setCustomerId(id);
    const selectedCustomer = customers.find((customer) => customer.id === id);
    if (selectedCustomer) {
      setListPrice(selectedCustomer.priceList.priceListItems);
    }
  };

  const handleSelectProduct = (id: number) => {
    setProductId(id);
    const selectedProduct = listPrice.find((item) => item.product.id === id);
    if (selectedProduct) {
      setPrice(selectedProduct.price);
    }
  };

  const handleAddProduct = () => {
    if (productId && price) {
      setItemsList([...temsList, { productId, quantity, price: +price }]);
      setProductId(null);
      setQuantity(1);
      setPrice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId && temsList.length > 0) {
      const saleData = {
        customerId: +customerId,
        sellItems: temsList,
        paid: true,
      };

      try {
        const sellResponse = await CreateSell(saleData);
        console.log("sellResponse", sellResponse);
        Swal.fire({
          title: "¡Listo!",
          text: "Se ha enviado la con id " + sellResponse.id,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        if (user?.role === "Administrador") {
          generateSalePDF(sellResponse);
        }
        router.push("/sells/list");
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "¡Error!",
          text: "No se ha podido enviar la venta por error " + error,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Formulario de Venta{" "}
        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </h1>
      <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
        {/* Selección de cliente */}
        <div className="flex flex-col">
          <label htmlFor="client" className="text-lg font-medium text-gray-600">
            Cliente
          </label>
          <select
            id="client"
            className="mt-2 p-3 border rounded-lg bg-gray-50"
            onChange={(e) => handleCustomerChange(Number(e.target.value))}
            required>
            <option value="">Seleccione un cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de producto */}
        <div className="flex flex-col">
          <label
            htmlFor="product"
            className="text-lg font-medium text-gray-600">
            Producto
          </label>
          <select
            id="product"
            className="mt-2 p-3 border rounded-lg bg-gray-50"
            onChange={(e) => handleSelectProduct(Number(e.target.value))}
            required>
            <option value="">Seleccione un producto</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad del producto */}
        <div className="flex flex-col">
          <label
            htmlFor="quantity"
            className="text-lg font-medium text-gray-600">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="mt-2 p-3 border rounded-lg bg-gray-50"
            required
          />
        </div>

        {/* Precio del producto */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-lg font-medium text-gray-600">
            Precio
          </label>
          <input
            type="number"
            id="price"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-2 p-3 border rounded-lg bg-gray-50"
          />
        </div>

        {/* Botón para agregar el producto */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddProduct}
            className="w-1/2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Agregar Producto
          </button>
        </div>

        {/* Mostrar los productos agregados */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Productos en la venta
          </h2>
          <ul className="space-y-4 mt-4">
            {temsList.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {products.find((prod) => prod.id === item.productId)?.name}
                </span>
                <span>
                  {item.quantity} x ${item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón para enviar la venta */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Realizar Venta
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellForm;
