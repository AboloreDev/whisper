"use client";

import React from "react";
import Container from "./Container";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import Header from "./Header";
import {
  api,
  useGetUserProfileQuery,
  useLogoutUserMutation,
} from "@/state/api";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { data: user } = useGetUserProfileQuery();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      router.push("/auth/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.data?.message || "Logout failed");
    }
  };
  return (
    <div className="bg-slate-300 border-b border-slate-300 fixed w-full top-0 z-40 backdrop-blur-md">
      <Container>
        <div className="flex justify-between items-center h-full p-4">
          <Link href={"/"} className="flex items-center gap-3 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 " />
            </div>
            <Header title="Whisper" />
          </Link>

          {user && (
            <div className="font-semibold flex items-center space-x-6">
              {/* Settings Page */}
              <Link
                href={"/dashboard/settings"}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {/* Settings Page */}
              <Link
                href={"/dashboard/profile"}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* Settings Page */}
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">
                  {isLoading ? "Logging out..." : "Logout"}
                </span>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
