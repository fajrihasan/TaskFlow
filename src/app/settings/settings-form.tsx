"use client";

import { useActionState } from "react";
import {
  updateDisplayName,
  updatePassword,
} from "./actions";

function ActionFeedback({
  state,
}: {
  state: { error: string | null; message: string | null };
}) {
  return (
    <>
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
    </>
  );
}

export default function SettingsForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const [profileState, profileAction, isSavingProfile] = useActionState(
    updateDisplayName,
    { error: null, message: null },
  );
  const [passwordState, passwordAction, isSavingPassword] = useActionState(
    updatePassword,
    { error: null, message: null },
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">Profil akun</h2>
        <p className="mt-1 text-sm text-slate-500">
          Email akun yang sedang digunakan.
        </p>
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          {email}
        </p>

        <form action={profileAction} className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Nama tampilan
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              maxLength={100}
              required
              defaultValue={fullName}
              className="min-h-11 rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <ActionFeedback state={profileState} />
          <button
            type="submit"
            disabled={isSavingProfile}
            className="min-h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile ? "Menyimpan..." : "Simpan nama"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">Ganti kata sandi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gunakan kata sandi baru minimal 6 karakter.
        </p>
        <form action={passwordAction} className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Kata sandi baru
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              required
              className="min-h-11 rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Konfirmasi kata sandi baru
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={6}
              maxLength={128}
              required
              className="min-h-11 rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <ActionFeedback state={passwordState} />
          <button
            type="submit"
            disabled={isSavingPassword}
            className="min-h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingPassword ? "Memperbarui..." : "Ganti kata sandi"}
          </button>
        </form>
      </section>
    </div>
  );
}
