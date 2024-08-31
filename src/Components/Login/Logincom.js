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
// import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getFirestore } from "firebase/firestore";
import { firestore } from "../Firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { app } from "../Firebase/firebase";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const Logincom = () => {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setopen] = useState(false);
  const [forgotemail, setforgotemail] = useState("");
  const [user, setuser] = useState();
  const navigate = useNavigate();
  const db = getFirestore(app);

  const handlesignin = async (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        const usersRef = collection(db, "users"); // Adjust "users" to your collection name
        const q = query(usersRef, where("email", "==", user.email));
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
            setuser(doc.data());
            Cookies.set(
              "user",
              JSON.stringify({
                email: doc.data().email,
                role: doc.data().role,
                driver: doc.data().driver,
                conductor: doc.data().conductor,
                username: doc.data().username,
                uid: doc.id,
              }),
              { expires: 7 }
            );
            if (user.role === "admin") {
              navigate("/services");
            } else {
              navigate("/dashboard");
            }
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Emial or password is incorrect");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast.error("Emial or password is incorrect");
      });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function sumDigits(num) {
    // Convert the number to a string, split into individual characters (digits),
    // convert them back to numbers, and sum them up
    return num
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  const onSubmit = (data) => {
    console.log(data);
    console.log("BOOLonSUbmt", isAdmin);
    const date = "12-12-2022";
    const newdate = new Date(date);
    console.log(newdate.getDate());
    const sum = sumDigits(newdate.getDate());
    console.log(sum);
    handlesignin(data);
  };
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                required
              />
            </div>

            <CardFooter>
              <Button type="submit" className="w-full mt-2`">
                Sign in
              </Button>
            </CardFooter>
            <div className="flex justify-center items-center w-full">
              <Label className="text-center">
                Already have an account?{" "}
                <Link to="/register " className="underline">
                  {" "}
                  Sign up
                </Link>
              </Label>
            </div>
          </form>
        </CardContent>
        {/* <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default Logincom;
