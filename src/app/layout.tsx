
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "./context/authContext";
import Link from "next/link";
import { useState } from "react";
import { homeOptions } from "@/utils/listOptions/homeOptions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export type userRole = "Administrador" | "Vendedor";


// Componente de Sidebar
const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const options = homeOptions[user?.role as userRole || "Vendedor"] || [];

  return (

    <>
      {/* Botón hamburguesa para móviles */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-auto z-40`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menú</h2>
          <nav>
            <ul className="space-y-2">
              {options.map((option) => (
                <li key={option.name}>
                  <Link
                    href={option.href}
                    className="block p-2 hover:bg-gray-800 rounded transition-colors"
                    onClick={() => setIsOpen(false)}>
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex gap-2`}>
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 w-full p-4  ">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
