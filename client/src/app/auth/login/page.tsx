"use client";

import AuthImagePattern from "@/components/code/AuthImagePattern";
import Header from "@/components/code/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormData, loginSchema } from "@/lib/schema";
import { useLoginUserMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { setShowPassword } from "@/state/slices";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginPage = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showPassword = useAppSelector((state) => state.global.showPassword);
  // Form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordToggle = () => {
    dispatch(setShowPassword());
  };

  // Loginnsubmit handler
  const handleLoginSubmit = async (data: LoginFormData) => {
    if (!data.email || !data.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { success, message } = await loginUser(data).unwrap();
      if (success) {
        toast.success(message || "Login successful!");
        form.reset();
        router.push("/dashboard");
      } else {
        toast.error(message || "Something went wrong");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-purple-600 flex items-center justify-center group-hover:bg-primart/30 transition-colors">
                <MessageSquare className="size-8" />
              </div>
              <Header
                title="Welcome back"
                subtitle="Get back into your account"
              />
            </div>
          </div>

          {/* FORM GOES HERE */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLoginSubmit, (err) => {
                console.log("Validation Errors", err);
              })}
              className="space-y-6"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@mail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password with Eye Icon Toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={handlePasswordToggle}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading" : "Login"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link className="text-blue-600 underline" href={"/auth/register"}>
                register
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <AuthImagePattern />
    </div>
  );
};

export default LoginPage;
