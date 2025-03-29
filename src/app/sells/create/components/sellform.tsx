"use client";

import GetCustomers from "@/api/customers/get-customers";
import GetProducts from "@/api/products/get-products";
import CreateSell, { SellData } from "@/api/sells/createSell";
import { useAuth } from "@/app/context/authContext";
import { generateSalePDF } from "@/utils/pdfs/remisionPdf";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalBill from "./modalBill";

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
  const [sellerLocation, setSellerLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [typeOfSell, setTypeOfSell] = useState<string>("");
  const [showModalBill, setShowModalBill] = useState(false);
  const [Bill, setBill] = useState<string>("");
  const DISTANCE_THRESHOLD = 0.5;

  const { user } = useAuth();

  const getSellerLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSellerLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          setError("No se pudo obtener la ubicación: " + error.message);
        }
      );
    } else {
      setError("Geolocalización no soportada por este navegador.");
    }
  };

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  };

  // Función para obtener los clientes desde la API
  const getCustomers = async () => {
    setLoading(true);
    try {
      const responseCustomers = await GetCustomers();
      setCustomers(
        responseCustomers.sort((a: any, b: any) => a.name.localeCompare(b.name))
      ); // Actualiza el estado con los clientes
    } catch (err: any) {
      setError("Error al obtener los clientes" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const responseProducts = await GetProducts();
      setProducts(
        responseProducts.filter(
          (p: any) => p.typeProduct.id === 4 || p.typeProduct.id === 5
        )
      );
    } catch (err: any) {
      setError("Error al obtener los productos" + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerLocation && customers.length > 0) {
      const updatedCustomers = customers.map((customer) => {
        const distance = haversineDistance(
          sellerLocation.lat,
          sellerLocation.lon,
          customer.lat,
          customer.lon
        );
        return { ...customer, distance };
      });

      if (showNearbyOnly) {
        setFilteredCustomers(
          updatedCustomers
            .filter((customer) => customer.distance <= DISTANCE_THRESHOLD)
            .sort((a, b) => a.distance - b.distance)
        );
      } else {
        setFilteredCustomers(
          updatedCustomers.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    } else {
      setFilteredCustomers(customers);
    }
  }, [sellerLocation, customers, showNearbyOnly]);

  useEffect(() => {
    getCustomers();
    getProducts();
    getSellerLocation();
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
    if (typeOfSell == "") {
      alert("Por favor ingrese un tipo de venta (contado o crédito).");
      return;
    }
    if (customerId && temsList.length > 0) {
      const saleData:SellData = {
        customerId: +customerId,
        sellItems: temsList,
        type: typeOfSell,
      };
      if (Bill !== "") {
        saleData.bill = Bill;
      }

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
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setShowNearbyOnly(true)}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              showNearbyOnly
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Nearby (500m)
          </button>
          <button
            type="button"
            onClick={() => setShowNearbyOnly(false)}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              !showNearbyOnly
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            All Customers
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setTypeOfSell("CASH")}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              typeOfSell === "CASH"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Cash
          </button>
          <button
            type="button"
            onClick={() => setTypeOfSell("CREDIT")}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              typeOfSell === "CREDIT"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
            Credit
          </button>
        </div>

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
            {filteredCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}{" "}
                {customer.distance
                  ? `(${customer.distance.toFixed(2)} km)`
                  : ""}
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
        <ModalBill
          showModal={showModalBill}
          setShowModal={setShowModalBill}
          Bill={Bill}
          setBill={setBill}
        />
      </form>
      {user?.role === "Administrador" ? (
        <button
          onClick={() => setShowModalBill(true)}
          className="w-auto p-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Facturas
        </button>
      ) : null}
    </div>
  );
};

export default SellForm;
