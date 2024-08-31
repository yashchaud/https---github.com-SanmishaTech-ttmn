import React, { useEffect } from "react";
import LayoutComp from "@/LayoutComp/LayoutComp";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboards from "@/Components/dashboard/Dashboard";
import Cookies from "js-cookie";
import Comapanies from "@/Components/Companies/Comapanies";
import Login from "@/Components/Login/Logincom";
import Register from "@/Components/Login/Register";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = Cookies.get("user");
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div>
      <Toaster position="top-center" richColors />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* {user && ( */}
        <>
          <Route path="/companies" element={<Dashboards />} />
          <Route path="/dashboard" element={<Dashboards />} />
          <Route path="/companies/add-company" element={<Dashboards />} />

          <Route path="/services" element={<LayoutComp />} />
          <Route path="/customer" element={<LayoutComp />} />
          <Route path="/enquiry" element={<LayoutComp />} />
          <Route path="/onboarding" element={<LayoutComp />} />
          <Route path="/user" element={<LayoutComp />} />
        </>
        {/* )} */}
      </Routes>
    </div>
  );
};

export default Dashboard;
