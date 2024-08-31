import React, { useState, useEffect } from "react";
import Background from "../../images/logoneu-removebg-preview.png";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import { PlusIcon, SearchIcon, CircleArrowLeft } from "lucide-react";

import { Button } from "@com/ui/button";
import { Input } from "@com/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@com/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@com/ui/card";
import { Label } from "@com/ui/label";
import Comapanies from "../Companies/Comapanies";
import Dashboardsubcomp from "./Dashboardsubcomp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import {
  doc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../Firebase/firebase";
import { getFirestore } from "firebase/firestore";
import { firestore } from "../Firebase/firebase";
import { Checkbox } from "@com/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@com/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@com/ui/sheet";

function AddCompanyForm({ addCompany }) {
  const db = getFirestore(app);
  const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    nsc: z.string().min(1, "NSC is required"),
    bse: z.string().min(1, "BSE is required"),
    cin: z
      .string()
      .min(21, "CIN must be 21 Characters")
      .max(21, "CIN must be 21 Characters"),
    doi: z.string().min(1, "Date of Incorporation is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    foundedDate: "",
    lastUpdated: "",
    nsc: "",
    bse: "",
    cin: "",
    doi: "",
  });

  const handleSubmits = async (data) => {
    console.log(data);
    // addCompany(newCompany);
    const docRef = doc(db, "companies", data.name);
    await addDoc(collection(firestore, "companies"), {
      name: data.name,
      nsc: data.nsc,
      bse: data.bse,
      cin: data.cin,
      doi: data.doi,
    });
    navigate("/dashboard");
  };

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-5">
          {/* <h1>Add New Company</h1> */}
        </div>
      </div>
      <Card className="w-full max-w-md mx-auto ">
        <CardHeader className="flex ">
          <div className="flex justify-between items-center ">
            <Link to="/companies">
              <Button variants="ghost">
                <span>
                  <CircleArrowLeft className="mr-2 h-4 w-4" />
                </span>
                Back
              </Button>
            </Link>
            <CardTitle>Add New Company</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSubmits)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" {...register("name")} required />
              {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="NSC">NSC</Label>
              <Input id="nsc" {...register("nsc")} required />
              {errors.nsc && (
                <span className="text-red-600">{errors.nsc.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bse">BSE</Label>
              <Input id="BSE" {...register("bse")} required />
              {errors.bse && (
                <span className="text-red-600">{errors.bse.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cin">CIN</Label>
              <Input id="CIN" type="text" {...register("cin")} required />
              {errors.cin && (
                <span className="text-red-600">{errors.cin.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastUpdated">Date of Incorporation</Label>
              <Input id="doi" type="date" {...register("doi")} required />
              {errors.doi && (
                <span className="text-red-600">{errors.doi.message}</span>
              )}
            </div>
            <Button type="submit" className="w-full">
              Add Company
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default function Component() {
  const navigate = useNavigate();
  const user = Cookies.get("user");

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addCompany = (company) => {
    setCompanies([...companies, { ...company, id: Date.now() }]);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col  w-full h-screen ">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {/*
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link> */}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              {/* <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link href="#" className="hover:text-foreground">
                Settings
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
              {/* <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              /> */}
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>{" "}
      <div className="flex h-screen bg-gray-100 max-md:flex-col">
        {/* Sidebar */}
        <div className="w-56 bg-white shadow-md max-md:w-full">
          {/* <div className="w-full flex justify-center items-center mt-6">
            <img
              className="w-[50%] mx-auto"
              src={Background}
              alt="background"
            />
          </div> */}
          <nav className="mt-5 text-center">
            <Link
              to="/companies"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              Companies
            </Link>
            <Link
              to="/dashboard"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-200"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <>
            {location.pathname === "/companies" && <Comapanies />}
            {location.pathname === "/dashboard" && <Dashboardsubcomp />}
            {location.pathname === "/companies/add-company" && (
              <AddCompanyForm addCompany={addCompany} />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
