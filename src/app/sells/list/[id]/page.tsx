import GetSellsById from "@/api/sells/get_sell_by_id";
import Link from "next/link";

// Define una interfaz para los props


export default async function SaleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await GetSellsById(id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Detalles de la Venta #{sale.id}
      </h1>

      {/* Información General */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Información General</h2>
        <p>
          <strong>Fecha de Creación:</strong>{" "}
          {new Date(sale.createDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> $
          {parseFloat(sale.totalPrice).toLocaleString()}
        </p>
        <p>
          <strong>Estado:</strong> {sale.paid ? "Pagado" : "Pendiente"}
        </p>
      </div>

      {/* Información del Vendedor */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Vendedor</h2>
        <p>
          <strong>Nombre:</strong> {sale.seller.name} {sale.seller.lastName}
        </p>
      </div>

      {/* Información del Cliente */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Cliente</h2>
        <p>
          <strong>Nombre:</strong> {sale.customer.name}
        </p>
        <p>
          <strong>NIT:</strong> {sale.customer.nit}
        </p>
        <p>
          <strong>Teléfono:</strong> {sale.customer.tel}
        </p>
        <p>
          <strong>Dirección:</strong> {sale.customer.address}
        </p>
      </div>

      {/* Detalle de Productos */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Productos Vendidos</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Producto</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Cantidad</th>
              <th className="border p-2 text-left">Precio Unitario</th>
              <th className="border p-2 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.sellItems.map((item: any) => (
              <tr key={item.id}>
                <td className="border p-2">{item.product.name}</td>
                <td className="border p-2">{item.product.description}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  ${parseFloat(item.price).toLocaleString()}
                </td>
                <td className="border p-2">
                  $
                  {(
                    parseFloat(item.price) * parseInt(item.quantity)
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para regresar */}
      <Link href="/sells/list">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Regresar
        </button>
      </Link>
    </div>
  );
}
