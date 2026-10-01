"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-500 text-xs px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 z-30 font-sans">
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-[#9e8b43]" />
        <span>&copy; {currentYear} Alexpoeima Art Studio CMS. All rights reserved.</span>
      </div>

      <div className="text-[11px] text-slate-500">
        <span>Powered by: <strong className="text-slate-800 font-semibold">Indeva Websites</strong></span>
      </div>
    </footer>
  );
}
