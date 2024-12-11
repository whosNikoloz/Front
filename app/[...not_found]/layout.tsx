import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - Java Final Project",
  description: "Page not found",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        <link rel="icon" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
