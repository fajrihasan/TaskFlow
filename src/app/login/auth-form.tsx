"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp } from "./actions";

type AuthMode = "login" | "register";

export default function AuthForm({
  confirmationError,
}: {
  confirmationError: boolean;
}) {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <Link href="/" className="mb-9 inline-flex items-center gap-3" aria-label="TaskFlow home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            T
          </span>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>

        <p className="text-sm font-medium text-indigo-600">
          {mode === "login" ? "Welcome back" : "Get started"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mode === "login"
            ? "Enter your details to continue to your workspace."
            : "Create an account to start organizing your tasks."}
        </p>

        <AuthFormFields
          key={mode}
          mode={mode}
          confirmationError={confirmationError}
        />

        <p className="mt-7 text-center text-sm text-slate-500">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}

function AuthFormFields({
  mode,
  confirmationError,
}: {
  mode: AuthMode;
  confirmationError: boolean;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, isPending] = useActionState(action, {
    error: confirmationError
      ? "Tautan konfirmasi tidak valid atau sudah kedaluwarsa. Silakan coba lagi."
      : null,
    message: null,
  });

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {mode === "register" && (
        <div>
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "register" ? 6 : undefined}
          maxLength={128}
          className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? "Please wait..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>
    </form>
  );
}
