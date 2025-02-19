import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProductionOrderPDF = (order: any) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text("Orden de Producción", 10, 10);

  // Información General
  doc.setFontSize(12);
  doc.text(`ID: ${order.id}`, 10, 20);
  doc.text(`Producto: ${order.product.name}`, 10, 30);
  doc.text(`Cantidad: ${order.quantity}`, 10, 40);
  doc.text(
    `Fecha de Creación: ${new Date(order.createDate).toLocaleString()}`,
    10,
    50
  );

  // Tabla de productos en la orden
  autoTable(doc, {
    startY: 60,
    head: [["ID", "Producto", "Cantidad", "Unidad"]],
    body: order.productionOrderItems.map((item: any) => [
      item.product.id,
      item.product.name,
      item.quantity,
      item.product.unit.name,
    ]),
  });

  // Descargar el PDF
  doc.save(`Orden_Produccion_${order.id}.pdf`);
};
