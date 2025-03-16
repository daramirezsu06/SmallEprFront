import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import LogoE7 from "../../../public/LogoE7.png"; // Asegúrate de que la ruta sea correcta
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Función para convertir la imagen a base64 (si no está ya en ese formato)
const getBase64Image = (imgUrl:any) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
  });
};

export const generateSalePDF = async (saleData:any) => {
  const doc = new jsPDF();

  // Convertir el logo a base64
  const logoBase64 = await getBase64Image(LogoE7.src) as string; // Usamos .src porque es un import de Next.js

  // Agregar el logo (ajusta las dimensiones y posición según prefieras)
  doc.addImage(logoBase64, "PNG", 14, 10, 30, 30); // Posición: arriba a la izquierda

  // Encabezado (ajustado para dejar espacio al logo)
  doc.setFontSize(10);
  doc.text("PRODUCTOS ESTRATO 7", 50, 20); // Movido a la derecha del logo
  doc.text("NIT: 70.553.933-4 - NO RESPONSABLE DE IVA", 50, 26);
  doc.text("CLI. 448 Sur #40A - 10 int. 101 Envigado - Antioquia", 50, 32);
  doc.text("Cel. 316 621 2713", 50, 38);
  doc.text("comercial@estrato7.co", 50, 44);

  // Título y número del documento
  doc.setFontSize(12);
  doc.text("DOCUMENTO EQUIVALENTE", 150, 20, { align: "right" });
  doc.text(`No. ${saleData.id}`, 150, 26, { align: "right" });

  // Fecha y cliente
  doc.setFontSize(10);
  const saleDate = new Date(saleData.createDate).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.text(`Fecha de transacción: ${saleDate}`, 14, 60);
  doc.text(`Nombre o Razón Social: ${saleData.customer.name}`, 14, 66);
  doc.text(`NIT: ${saleData.customer.nit}`, 14, 72);
  doc.text(`Tel: ${saleData.customer.tel}`, 14, 78);

  // Tabla de ítems
  const tableData = saleData.sellItems.map((item:any) => [
    item.quantity,
    item.product.name,
    parseFloat(item.price).toLocaleString("es-CO"),
    (item.quantity * item.price).toLocaleString("es-CO"),
  ]);

  autoTable(doc, {
    startY: 90,
    head: [["Cantidad", "Concepto", "Vr. Unitario", "Vr. Total"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 80 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
    },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY || 90;
  doc.setFontSize(12);
  doc.text(
    `Total: ${parseFloat(saleData.totalPrice).toLocaleString("es-CO")}`,
    150,
    finalY + 10,
    { align: "right" }
  );

  // Notas legales
  doc.setFontSize(8);
  doc.text(
    "Favor consignar en cuenta ahorros bancolombia No. 10050205705\n" +
      "“DOCUMENTO EQUIVALENTE a la Factura de adquisiciones de bienes y servicios " +
      "efectuadas por responsables del Régimen común a personas naturales no comerciantes " +
      "o inscritas en el Régimen Simplificado. Este documento cumple con los requisitos para la " +
      "procedencia de costos, deducciones e impuestos descontables por operaciones " +
      "realizadas con no obligados a facturar” (art 3ºDR3050/97)",
    14,
    finalY + 20,
    { maxWidth: 180 }
  );

  // Pie de página
  doc.text(`C.C./NIT: ${saleData.customer.nit}`, 14, finalY + 60);

  // Descarga del PDF
  doc.save(`Venta_${saleData.id}.pdf`);
};
