import { useState, useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
function App() {
  const user = Cookies.get("user");
  const location = useLocation();

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
