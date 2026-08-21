import React from "react";
import { AppSidebarLayout } from "@/components/app-sidebar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
