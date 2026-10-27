"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../library/supabase/server";

export type SettingsActionState = {
  error: string | null;
  message: string | null;
};

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    return { error, supabase, user: null };
  }

  return { error: null, supabase, user };
}

function getValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getPassword(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function updateDisplayName(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const fullName = getValue(formData, "fullName");

  if (!fullName || fullName.length > 100) {
    return {
      error: "Nama wajib diisi dan maksimal 100 karakter.",
      message: null,
    };
  }

  const { supabase, user, error: authError } = await getAuthenticatedClient();

  if (authError) {
    return { error: authError.message, message: null };
  }

  if (!user) {
    return {
      error: "Sesi Anda berakhir. Silakan masuk kembali.",
      message: null,
    };
  }

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return { error: error.message, message: null };
  }

  revalidatePath("/");
  return { error: null, message: "Nama tampilan berhasil diperbarui." };
}

export async function updatePassword(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const password = getPassword(formData, "password");
  const confirmPassword = getPassword(formData, "confirmPassword");

  if (password.length < 6 || password.length > 128) {
    return {
      error: "Kata sandi harus terdiri dari 6 hingga 128 karakter.",
      message: null,
    };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak cocok.", message: null };
  }

  const { supabase, user, error: authError } = await getAuthenticatedClient();

  if (authError) {
    return { error: authError.message, message: null };
  }

  if (!user) {
    return {
      error: "Sesi Anda berakhir. Silakan masuk kembali.",
      message: null,
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, message: null };
  }

  return { error: null, message: "Kata sandi berhasil diganti." };
}
