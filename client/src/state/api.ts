import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, AuthResponse, User } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: "include",
  }),
  reducerPath: "api",
  tagTypes: ["User", "Auth"],
  endpoints: (build) => ({
    // CHECK FOR AUTHENTICATED USER
    getUserProfile: build.query<User, void>({
      query: () => "/user",
      providesTags: ["User"],
    }),

    // Register new user
    registerUser: build.mutation<
      AuthResponse,
      {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        profilePic: string;
      }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // Login user
    loginUser: build.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // Logout user
    logoutUser: build.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Uplaod image on profile
    uploadProfileImage: build.mutation<ApiResponse<object>, FormData>({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useUploadProfileImageMutation,
} = api;
