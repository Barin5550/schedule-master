import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Авторизация",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-brand-black">{children}</div>;
}
