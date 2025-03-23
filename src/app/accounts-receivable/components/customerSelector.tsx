"use client";
import { useState, useEffect } from "react";

import GetCustomers from "@/api/customers/get-customers";

interface Customer {
  id: number;
  name: string;
  nit: string;
  tel: string;
}

interface CustomerSelectorProps {
  onCustomerSelect: (customerId: number) => void;
}
const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  onCustomerSelect,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Cargar los clientes desde el endpoint
  useEffect(() => {
    const fetchCustomers = async () => {
      const customer = await GetCustomers();
      setCustomers(customer);
    };
    fetchCustomers();
  }, []);

  // Filtrar clientes mientras el usuario escribe
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers([]);
      setIsOpen(false);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.nit.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
      setIsOpen(true);
    }
  }, [searchTerm, customers]);

  // Manejar selección de cliente
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(`${customer.name} (NIT: ${customer.nit})`);
    setIsOpen(false);
  };

  // Manejar el envío al formulario de pago
  const handleContinue = () => {
    if (selectedCustomer) {
      onCustomerSelect(selectedCustomer.id);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Seleccionar Cliente
      </h2>
      <div className="relative">
        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar cliente por nombre o NIT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Desplegable con resultados */}
        {isOpen && filteredCustomers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => handleSelectCustomer(customer)}
                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                <span className="text-gray-800">{customer.name}</span>
                <span className="text-gray-500 text-sm">
                  NIT: {customer.nit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Botón de continuar */}
      <button
        onClick={handleContinue}
        disabled={!selectedCustomer}
        className={`w-full mt-4 py-2 rounded-lg text-white font-medium ${
          selectedCustomer
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        } transition-colors duration-200`}>
        Continuar
      </button>
    </div>
  );
};

export default CustomerSelector;
