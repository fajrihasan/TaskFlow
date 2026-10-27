import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (typeof supabaseUrl !== "string" || !supabaseUrl) {
    throw new Error("Supabase URL belum diatur");
  }

  if (typeof supabaseKey !== "string" || !supabaseKey) {
    throw new Error("Supabase publishable key belum diatur");
  }

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes(
              "Cookies can only be modified in a Server Action or Route Handler",
            )
          ) {
            console.warn(
              "Supabase auth cookies could not be refreshed during Server Component rendering; src/proxy.ts handles session refresh.",
            );
            return;
          }

          throw error;
        }
      },
    },
  });
}