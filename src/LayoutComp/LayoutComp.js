import React, { useState, useEffect } from "react";
import { Button } from "@com/ui/button";

// import NavComponent from "../Components/Sidebar/Navbar";
// import Link from "next/link";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { Badge } from "@com/ui/badge";
import Logo from "../images/icons8-document-375.png";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@com/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@com/ui/select";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";

const LayoutComp = () => {
  const navigate = useNavigate();
  const user = Cookies.get("user");

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [open, setOpen] = useState(false);
  const [query, SetQuery] = useState("");
  const [logout, setlogout] = useState(false);
  const location = useLocation();
  const { documentId } = useParams();
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* {logout && <LogoutPrompt setlogout={setlogout} logout={logout} />} */}
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a
                className="flex items-center gap-2 font-semibold"
                href="/services"
              >
                <img style={{ width: "40px" }} src={Logo} alt="" />
                <span className="">CRM</span>
              </a>
            </div>
            {/* <NavComponent /> */}
          </div>
        </div>
        <div className="flex flex-col">
          <Headercomp />
          {/* {location.pathname === "/users" ? <Userlist /> : renderContent()} */}
          {location.pathname === "/services" && <Services />}
          {location.pathname === "/customer" && <Customer />}
          {location.pathname === "/enquiry" && <Enquiry />}
          {location.pathname === "/onboarding" && <Onboarding />}
          {location.pathname === "/user" && <User />}
        </div>
      </div>
    </>
  );
};

export default LayoutComp;
