import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Whisper Chat App",
  description: "An End to End chat messaging systemserver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="poppins-regular">{children}</body>
    </html>
  );
}
