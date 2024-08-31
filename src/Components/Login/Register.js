import React, { useState } from "react";
import { Button } from "@com/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@com/ui/card";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, app } from "../Firebase/firebase"; // Assume firestore and app are defined in firebase config
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  mobile: z.string().min(1, "Mobile is required"),
  time: z.string().min(1, "Time of Birth is required"),
  birthcity: z.string().min(1, "Birth City is required"),
  dob: z.string().min(1, "Date of Birth is required"),
});

const Logincom = () => {
  const [uniqueData, setUniqueData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = getFirestore(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // function sumDigits(num) {
  //   return num
  //     .toString()
  //     .split("")
  //     .map(Number)
  //     .reduce((a, b) => a + b, 0);
  // }

  const sumDateDigits = (dateStr) => {
    return dateStr
      .replace(/\D/g, "") // Remove non-digit characters
      .split("") // Split each digit
      .map(Number) // Convert to numbers
      .reduce((a, b) => a + b, 0); // Sum them up
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

  const onSubmit = (data) => {
    toast.loading("Registering...");
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          time: data.time,
          birthcity: data.birthcity,
          driver: sumDigits(new Date(data.dob).getDate()),
          conductor: sumDigits(sumDateDigits(data.dob)),
          dob: data.dob,
        });
      })
      .then(() => {
        toast.dismiss();
        toast.success("Registration successful");
        navigate("/"); // Adjust URL as needed
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message}`);
      });
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details below to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-2">
              <Label>Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Mobile</Label>
              <Input
                id="mobile"
                type="text"
                placeholder="Mobile"
                {...register("mobile")}
              />
              {errors.mobile && (
                <span className="text-red-500">{errors.mobile.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Time of Birth</Label>
              <Input
                id="time"
                type="time"
                placeholder="Time of Birth"
                {...register("time")}
              />
              {errors.time && (
                <span className="text-red-500">{errors.time.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Birth City</Label>
              <Input
                id="birthcity"
                type="text"
                placeholder="Birth City"
                {...register("birthcity")}
              />
              {errors.birthcity && (
                <span className="text-red-500">{errors.birthcity.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                placeholder="Date of Birth"
                {...register("dob")}
              />
              {errors.dob && (
                <span className="text-red-500">{errors.dob.message}</span>
              )}
            </div>

            <CardFooter>
              <Button type="submit" className="w-full mt-2">
                Register
              </Button>
            </CardFooter>
            <div className="flex justify-center items-center w-full">
              <Label className="text-center ">
                Already have an account?{" "}
                <Link to="/ " className="underline">
                  {" "}
                  Sign in
                </Link>
              </Label>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logincom;
