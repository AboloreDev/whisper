"use client";
import { useGetUserProfileQuery } from "@/state/api";
import { Mail, User } from "lucide-react";
import React from "react";

const UserInfo = () => {
  const { data: user, isLoading } = useGetUserProfileQuery();
  return (
    <>
      <div className="space-y-1.5">
        <div className="text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          First Name
        </div>
        <p className="px-4 py-2.5 rounded-lg border-2">{user?.firstName}</p>
      </div>

      <div className="space-y-1.5">
        <div className="text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          Last Name
        </div>
        <p className="px-4 py-2.5 rounded-lg border-2">{user?.lastName}</p>
      </div>

      <div className="space-y-1.5">
        <div className="text-sm flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </div>
        <p className="px-4 py-2.5 rounded-lg border-2">{user?.email}</p>
      </div>

      <div className="space-y-6 rounded-xl p-4">
        <h2 className="text-lg font-medium">Account Information</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b">
            <p>Member since</p>
            <span>{user?.createdAt?.split("T")[0]}</span>
          </div>

          <div className="flex items-center justify-between">
            <p>Account status</p>
            <span className="text-green-600">active</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
