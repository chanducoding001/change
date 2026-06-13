import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const role = user?.role;
  // const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role");

  if (token) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;