import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookie from "universal-cookie";
const cookies = new Cookie();

export function PrivateRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();
  if (!cookies.get("accessToken")) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
}
