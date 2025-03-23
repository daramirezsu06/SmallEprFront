// interface PendingSell {
//   id: number;
//   totalPrice: string;
//   status: string;
//   pendingAmount: number;
//   createDate: string;
//   customer: { name: string };
// }

import { PendingSell } from "@/app/accounts-receivable/list/page";

export const PendingSellColumns: {
  name: string;
  selector: keyof PendingSell | ((row: PendingSell) => React.ReactNode);
}[] = [
  { name: "Id", selector: "id" },
  { name: "Cliente", selector: (row: PendingSell) => row.customer.name },
  { name: "Fecha de Creación", selector: "createDate" },
  { name: "estado", selector: "status" },
  { name: "valor factura", selector: "totalPrice" },
  { name: "valor pendiente", selector: "pendingAmount" },
];
