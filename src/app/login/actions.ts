"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "../../library/supabase/server";

export type AuthActionState = {
  error: string | null;
  message: string | null;
};

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getPassword(formData: FormData) {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getField(formData, "email");
  const password = getPassword(formData);

  if (email.length > 254 || password.length > 128) {
    return { error: "Email atau kata sandi terlalu panjang.", message: null };
  }

  if (!isValidEmail(email) || !password) {
    return { error: "Masukkan email dan kata sandi yang valid.", message: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, message: null };
  }

  redirect("/");
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getField(formData, "fullName");
  const email = getField(formData, "email");
  const password = getPassword(formData);

  if (fullName.length > 100 || email.length > 254) {
    return { error: "Nama atau email terlalu panjang.", message: null };
  }

  if (!fullName) {
    return { error: "Nama lengkap wajib diisi.", message: null };
  }

  if (!isValidEmail(email)) {
    return { error: "Masukkan alamat email yang valid.", message: null };
  }

  if (password.length < 6) {
    return {
      error: "Kata sandi harus terdiri dari minimal 6 karakter.",
      message: null,
    };
  }

  if (password.length > 128) {
    return { error: "Kata sandi terlalu panjang.", message: null };
  }

  const origin = (await headers()).get("origin");

  if (!origin) {
    return {
      error: "Tidak dapat menentukan alamat untuk konfirmasi email.",
      message: null,
    };
  }

  const originUrl = new URL(origin);

  if (originUrl.protocol !== "http:" && originUrl.protocol !== "https:") {
    return {
      error: "Alamat untuk konfirmasi email tidak valid.",
      message: null,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: new URL("/auth/callback", originUrl).toString(),
    },
  });

  if (error) {
    return { error: error.message, message: null };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    error: null,
    message: "Akun berhasil dibuat. Periksa email Anda untuk mengonfirmasi akun.",
  };
}

export async function signOut(): Promise<AuthActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message, message: null };
  }

  redirect("/login");
}
