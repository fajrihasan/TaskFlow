"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Supabase URL belum diatur");
  }

  if (!supabaseKey) {
    throw new Error("Supabase publishable key belum diatur");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}