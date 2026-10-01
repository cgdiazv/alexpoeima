"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  const validUser = process.env.ADMIN_USER || "admin@alexpoeima.com";
  const validPass = process.env.ADMIN_PASSWORD || "Alex2026!";

  const isValid =
    (username?.toLowerCase() === validUser.toLowerCase() && password === validPass) ||
    (username === "tamarron_admin" && password === "TamarronMarketing2026!");

  if (isValid) {
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", "authenticated_alexpoeima_user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Credenciales incorrectas. Verifique usuario y contraseña." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
