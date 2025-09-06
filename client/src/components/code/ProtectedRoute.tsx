"use client";

import { useGetUserProfileQuery } from "@/state/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetUserProfileQuery();

  useEffect(() => {
    if (isLoading) return;

    // Handle authentication errors or token expiry
    if (isError || !user) {
      toast.error("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }
    // check for user
    if (user) {
      toast.success("User Authenticated");
      router.push("/dashboard");
      return;
    }
  }, [user, isLoading, isError, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
