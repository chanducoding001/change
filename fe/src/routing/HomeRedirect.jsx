import React from 'react'
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "user") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;

}

export default HomeRedirect;