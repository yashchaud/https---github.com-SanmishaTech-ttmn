import React, { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@com/ui/card";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { app } from "../Firebase/firebase";
import { Label } from "@com/ui/label";
import { Separator } from "@com/ui/separator";
import Cookies from "js-cookie";

const Dashboardsubcomp = () => {
  const [companies, setCompanies] = useState([]);
  const db = getFirestore(app);
  const [searchTerm, setSearchTerm] = useState("");
  const parse = Cookies.get("user");
  let user;
  if (parse) {
    user = JSON.parse(parse);
  }

  useEffect(() => {
    console.log("Fetching data...");
    fetchCompanyData();
  }, []);

  function fetchCompanyData() {
    const companiesRef = collection(db, "companies");
    getDocs(companiesRef).then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const companyData = doc.data();
        const calculatedData = calculateFields(companyData);
        data.push({
          ...companyData,
          ...calculatedData,
        });
      });
      setCompanies(data);
    });
  }

  const CalculatePercentage = (company) => {
    var percentage = 0;
    const Favorable = {
      1: {
        list: [2, 3, 4, 5, 6, 7, 9],
        mostFavorable: [3, 5, 6],
        bad: [],
      },
      2: {
        list: [1, 5, 3, 6],
        mostFavorable: [1, 3, 6],
        bad: [8, 9],
      },
      3: {
        list: [1, 5, 9],
        mostFavorable: [1, 5],
        bad: [6],
      },
      4: {
        list: [6, 1, 5, 3],
        mostFavorable: [6, 1, 5],
        bad: [8],
      },
      5: {
        list: [1, 3, 6, 2],
        mostFavorable: [1, 3, 6],
        bad: [],
      },
      6: {
        list: [1, 5, 4, 7],
        mostFavorable: [1, 4, 7],
        bad: [3],
      },
      7: {
        list: [6, 1, 5, 3],
        mostFavorable: [6, 1, 5],
        bad: [],
      },
      8: {
        list: [6, 3, 5],
        mostFavorable: [6, 3, 5],
        bad: [1, 2],
      },
      9: {
        list: [1, 5, 3, 6],
        mostFavorable: [1],
        bad: [8],
      },
    };
    Favorable[user && user?.driver].list.forEach((element) => {
      if (company.nameValue === element) {
        percentage += 25;
      }
      if (company.cinValue === element) {
        percentage += 25;
      }
      if (company.driver === element) {
        percentage += 25;
      }
      if (company.conductor === element) {
        percentage += 25;
      }
    });

    if (percentage > 100) {
      percentage = 100;
    }

    return percentage;
  };

  function calculateFields(company) {
    const mapping = {
      A: 1,
      I: 1,
      J: 1,
      Q: 1,
      Y: 1,
      B: 2,
      K: 2,
      R: 2,
      C: 3,
      G: 3,
      L: 3,
      S: 3,
      D: 4,
      M: 4,
      T: 4,
      H: 5,
      E: 5,
      N: 5,
      X: 5,
      U: 6,
      V: 6,
      W: 6,
      O: 7,
      Z: 7,
      P: 8,
      F: 8,
    };

    const sumDigits = (num) => {
      while (num >= 10) {
        num = num
          .toString()
          .split("")
          .map(Number)
          .reduce((a, b) => a + b, 0);
      }
      return num;
    };

    const calculateNameValue = (name) => {
      const nameValue = name
        .toUpperCase()
        .split("")
        .map((char) => mapping[char] || 0)
        .reduce((a, b) => a + b, 0);
      return sumDigits(nameValue);
    };

    const calculateCinValue = (cin) => {
      const cinValue = cin
        .toUpperCase()
        .split("")
        .map((char) =>
          char >= "0" && char <= "9" ? Number(char) : mapping[char] || 0
        )
        .reduce((a, b) => a + b, 0);
      return sumDigits(cinValue);
    };

    const sumDateDigits = (dateStr) => {
      return dateStr
        .replace(/\D/g, "") // Remove non-digit characters
        .split("") // Split each digit
        .map(Number) // Convert to numbers
        .reduce((a, b) => a + b, 0); // Sum them up
    };

    const driver = sumDigits(new Date(company.doi).getDate());
    const conductor = sumDigits(sumDateDigits(company.doi));

    return {
      ...company,
      nameValue: calculateNameValue(company.name),
      cinValue: calculateCinValue(company.cin),
      driver,
      conductor,
    };
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {searchTerm.length > 0 &&
        user &&
        filteredCompanies.map((company) => (
          <Card className="mt-2">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-2xl">{company.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 w-full">
              <Table className="min-w-md">
                <TableHeader>
                  <TableRow>
                    <TableHead>{company.cin}</TableHead>

                    <TableHead className="text-right">{company.doi}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={company.id}>
                    <TableCell>{user?.driver}</TableCell>

                    <TableCell className="flex justify-end">
                      {/* {company.nameValue} */}
                      <div className="flex h-5 items-center space-x-4 text-sm">
                        <h4>As Per Company Name</h4>
                        <Separator orientation="vertical" />

                        <div>{company.nameValue}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="min-w-[92rem]" key={company.id}>
                    <TableCell>{}</TableCell>

                    <TableCell className="flex justify-end min-w-[20rem]">
                      {/* {company.cinValue} */}
                      <div className="flex h-5 items-center space-x-4 text-sm">
                        <h4>As Per Comapny CIN</h4>
                        <Separator orientation="vertical" />

                        <div>{company.cinValue}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow key={company.id}>
                    <TableCell>{}</TableCell>

                    <TableCell className="flex justify-end">
                      {/* {company.driver} */}
                      <div className="flex h-5 items-center space-x-4 text-sm">
                        <h4>As Per Incorporation Date Driver</h4>
                        <Separator orientation="vertical" />

                        <div>{company.driver}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow key={company.id}>
                    <TableCell>{}</TableCell>

                    <TableCell className="flex justify-end">
                      {/* {company.conductor} */}
                      <div className="flex h-5 items-center space-x-4 text-sm">
                        <h4>As Per Incorporation Date Conductor</h4>
                        <Separator orientation="vertical" />

                        <div>{company.conductor}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Label>Total Percentage</Label>
              <Label>
                Favorable Percentage
                {" " + CalculatePercentage(company) + "%"}
              </Label>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default Dashboardsubcomp;
