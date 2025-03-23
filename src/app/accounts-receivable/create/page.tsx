"use client";
import { useState } from "react";
import CustomerSelector from "../components/customerSelector";
import PaymentForm from "../components/paymentForm";


const PaymentPage = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  return (
    <div>
      {!selectedCustomerId ? (
        <CustomerSelector
          onCustomerSelect={(customerId) => setSelectedCustomerId(customerId)}
        />
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => setSelectedCustomerId(null)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Cambiar Cliente
          </button>
          <PaymentForm customerId={selectedCustomerId} />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
