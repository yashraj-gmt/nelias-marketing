import { Navigate } from "react-router-dom";
import { features } from "@/config/features";
import { ConfiguratorApp } from "@/sections/configurator/ConfiguratorApp";

export default function ConfigurePage() {
  if (!features.configurator) {
    return <Navigate to="/demo" replace />;
  }

  return <ConfiguratorApp />;
}
