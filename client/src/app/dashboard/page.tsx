import ProtectedRoute from "@/components/code/ProtectedRoute";
import React from "react";

const Homepage = () => {
  return (
    <ProtectedRoute>
      <div>Hello</div>
    </ProtectedRoute>
  );
};

export default Homepage;
