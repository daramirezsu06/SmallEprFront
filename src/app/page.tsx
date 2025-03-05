"use client";
import RenderOptions from "./components/Table/options";
import { homeOptions } from "@/utils/listOptions/homeOptions";
import { useAuth } from "./context/authContext";
import { userRole } from "./layout";

export default function Home() {
  const { user } = useAuth();

  return <RenderOptions options={homeOptions[user?.role as userRole || "Vendedor"]} />;
}
