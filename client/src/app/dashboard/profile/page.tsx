"use client";

import Container from "@/components/code/Container";
import Header from "@/components/code/Header";
import UserInfo from "@/components/code/UserInfo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetUserProfileQuery,
  useUploadProfileImageMutation,
} from "@/state/api";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { data: user, isLoading } = useGetUserProfileQuery();

  const [uploadImage] = useUploadProfileImageMutation();

  console.log(user);

  // handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await uploadImage(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="h-screen py-16 mt-20">
      <Container>
        <div className="bg-slate-300 rounded-xl p-6 space-x-6">
          <div className="text-center mb-4">
            <Header
              title="Profile"
              subtitle="View and update profile information"
            />
          </div>

          {/* Avatar/Image upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={user?.profilePic || "/auth.jpg"}
                alt="Aavatar"
                width={200}
                height={200}
                className="rounded-full object-cover border-2 size-32"
              />
              <Label
                className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all duration-200"
                htmlFor="image-upload" ${
                  isLoading ? "animate-pointer pointer-events-none" : ""
                }`}
              >
                <Camera className="w-6 h-6" />
                <Input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  disabled={isLoading}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Label>
            </div>
            <p className="text-sm font-thin">
              {isLoading
                ? "Uploading...."
                : "Click on the camera to update your image"}
            </p>
          </div>

          {/* User Info Section */}
          <div className="space-y-6">
            <UserInfo />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
