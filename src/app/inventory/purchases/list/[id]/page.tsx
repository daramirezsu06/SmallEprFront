import GetPurchaseById from "@/api/purchases/get_purchase_by_id";
import Link from "next/link";

export default async function PurchaseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await GetPurchaseById(id);

  if (!purchase) return <div>Cargando...</div>;

  // Calcular el total de la compra (suma de cantidad * costo por cada producto)
  const total = purchase.InventoryMovements.reduce(
    (sum: number, item: any) =>
      sum + parseFloat(item.quantity) * parseFloat(item.cost),
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Detalles de la Compra #{purchase.id}
      </h1>

      {/* Información General */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Información General</h2>
        <p>
          <strong>Número de Factura:</strong> {purchase.Factura}
        </p>
        <p>
          <strong>Fecha de la Compra:</strong>{" "}
          {new Date(purchase.data).toLocaleDateString()}
        </p>
        <p>
          <strong>Fecha de Creación:</strong>{" "}
          {new Date(purchase.createDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> ${total.toLocaleString()}
        </p>
      </div>

      {/* Información del Proveedor */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Proveedor</h2>
        <p>
          <strong>Nombre:</strong> {purchase.supplier.name}
        </p>
        <p>
          <strong>NIT:</strong> {purchase.supplier.NIT}
        </p>
        <p>
          <strong>Teléfono:</strong> {purchase.supplier.tel}
        </p>
        <p>
          <strong>Dirección:</strong> {purchase.supplier.address}
        </p>
      </div>

      {/* Detalle de Productos */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Productos Comprados</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Producto</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Cantidad</th>
              {/* No mostramos el costo unitario ni el subtotal, ya que pediste omitir costos */}
            </tr>
          </thead>
          <tbody>
            {purchase.InventoryMovements.map((item: any) => (
              <tr key={item.id}>
                <td className="border p-2">{item.product.name}</td>
                <td className="border p-2">{item.product.description}</td>
                <td className="border p-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para regresar */}
      <Link href="/purchases/list">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Regresar
        </button>
      </Link>
    </div>
  );
}
