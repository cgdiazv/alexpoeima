"use client";

import React from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

export function AdminDashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <AdminHeader />
      <div className="flex-1 flex flex-col">{children}</div>
      <AdminFooter />
    </div>
  );
}
