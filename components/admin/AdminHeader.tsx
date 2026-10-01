"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { Sparkles, ExternalLink, LogOut, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 px-6 py-3.5 flex items-center justify-between font-sans shadow-xs">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">

          <div>
            <span className="font-extrabold uppercase tracking-widest text-xs text-slate-900 block leading-none">
              Alexpoeima CMS
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider">
              Studio Management Console
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Quick Links & Actions */}
      <div className="flex items-center gap-3">
        {/* View Storefront button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-all border border-slate-200"
          title="Ver tienda pública"
        >
          <span>Ver Tienda</span>
          <ExternalLink size={13} className="text-[#9e8b43]" />
        </a>

        {/* User Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <ShieldCheck size={14} className="text-[#9e8b43]" />
          <span className="font-semibold text-slate-700">admin@alexpoeima.com</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
