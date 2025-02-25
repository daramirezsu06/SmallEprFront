"use client";
import RenderOptions from "./components/Table/options";
import { homeOptions } from "@/utils/listOptions/homeOptions";
import { useAuth } from "./context/authContext";

export default function Home() {
  const { user } = useAuth();

  return <RenderOptions options={homeOptions[user?.role || "Vendedor"]} />;
}
