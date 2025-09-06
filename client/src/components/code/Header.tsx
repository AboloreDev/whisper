import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm mt-1">{subtitle}</p>
    </div>
  );
};

export default Header;
