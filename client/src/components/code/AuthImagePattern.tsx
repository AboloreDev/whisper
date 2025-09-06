"use client";

import React from "react";
import Header from "./Header";
import Image from "next/image";

const AuthImagePattern = () => {
  return (
    <div className="hidden lg:flex items-center justify-center p-12">
      <div className="max-w-md text-center">
        <Image
          src={"/auth.jpg"}
          alt="Messaging Image"
          width={400}
          height={400}
        />
        <Header
          title="Join our community"
          subtitle="Connect with friends, share moments and stay in touch"
        />
      </div>
    </div>
  );
};

export default AuthImagePattern;
