import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon } from "lucide-react";

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
import { getFirestore } from "firebase/firestore";
import { firestore } from "../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { app } from "../Firebase/firebase";

const Comapanies = () => {
  const [companies, setCompanies] = useState([]);
  const [tableData, setTableData] = useState([]);
  const db = getFirestore(app);
  useEffect(() => {
    console.log("Fetching data...");
    const companies = collection(db, "companies");
    getDocs(companies).then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setTableData(data);
    });
  }, []);
  return (
    <div className="p-8 max-md:p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Link to="/companies/add-company">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Company
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Founded Date</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.cin}</TableCell>
              <TableCell>{company.bse}</TableCell>
              <TableCell>{company.nsc}</TableCell>
              <TableCell>{company.doi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Comapanies;
