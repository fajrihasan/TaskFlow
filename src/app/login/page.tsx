import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "../../library/supabase/server";
import AuthForm from "./auth-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();

  const [params, supabase] = await Promise.all([searchParams, createClient()]);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }

  if (user) {
    redirect("/");
  }

  return <AuthForm confirmationError={params.error === "confirmation"} />;
}

function LoginFallback() {
  return (
    <main
      role="status"
      className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-sm text-slate-500"
    >
      Loading...
    </main>
  );
}
