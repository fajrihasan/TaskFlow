"use client";

import { useState } from "react";
import { useActionState } from "react";
import type { Task } from "../../library/supabase/database.types";
import { saveTask } from "./actions";

const statuses = [
  { value: "todo", label: "Belum dikerjakan" },
  { value: "in_progress", label: "Sedang dikerjakan" },
  { value: "done", label: "Selesai" },
] as const;

const priorities = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
] as const;

export default function TaskManager({ tasks }: { tasks: Task[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [state, formAction, isPending] = useActionState(saveTask, {
    error: null,
    message: null,
  });
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !normalizedSearch ||
      task.title.toLocaleLowerCase().includes(normalizedSearch) ||
      (task.description ?? "").toLocaleLowerCase().includes(normalizedSearch);

    return (
      matchesSearch &&
      (!statusFilter || task.status === statusFilter) &&
      (!priorityFilter || task.priority === priorityFilter)
    );
  });

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <input type="hidden" name="intent" value="create" />
        <h2 className="text-lg font-semibold">Buat tugas</h2>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Judul
            <input
              name="title"
              type="text"
              maxLength={200}
              required
              className="min-h-11 rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              placeholder="Contoh: Selesaikan laporan"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Deskripsi
            <textarea
              name="description"
              rows={3}
              maxLength={5000}
              className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              placeholder="Tambahkan detail (opsional)"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium">
              Status
              <select
                name="status"
                defaultValue="todo"
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Prioritas
              <select
                name="priority"
                defaultValue="medium"
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Tenggat
              <input
                name="dueDate"
                type="date"
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 justify-self-start rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Menyimpan..." : "Tambah tugas"}
          </button>
        </div>
      </form>

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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Daftar tugas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Menampilkan {filteredTasks.length} dari {tasks.length} tugas.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-auto">
            <label className="grid gap-1.5 text-xs font-medium text-slate-600">
              Cari tugas
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Judul atau deskripsi"
                className="min-h-10 rounded-xl border border-slate-300 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-slate-600">
              Filter status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Semua status</option>
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-medium text-slate-600">
              Filter prioritas
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Semua prioritas</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="font-semibold">
            {tasks.length === 0 ? "Belum ada tugas" : "Tidak ada tugas yang cocok"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {tasks.length === 0
              ? "Buat tugas pertama Anda menggunakan formulir di atas."
              : "Coba ubah kata pencarian atau filter Anda."}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <form action={formAction} className="grid gap-4">
                <input type="hidden" name="taskId" value={task.id} />
                <label className="grid gap-2 text-sm font-medium">
                  Judul
                  <input
                    name="title"
                    type="text"
                    maxLength={200}
                    required
                    defaultValue={task.title}
                    className="min-h-11 rounded-xl border border-slate-300 px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Deskripsi
                  <textarea
                    name="description"
                    rows={2}
                    maxLength={5000}
                    defaultValue={task.description ?? ""}
                    className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2 text-sm font-medium">
                    Status
                    <select
                      name="status"
                      defaultValue={task.status}
                      className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Prioritas
                    <select
                      name="priority"
                      defaultValue={task.priority}
                      className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Tenggat
                    <input
                      name="dueDate"
                      type="date"
                      defaultValue={task.due_date ?? ""}
                      className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 font-normal outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    name="intent"
                    value="update"
                    disabled={isPending}
                    className="min-h-10 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Simpan perubahan
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value="delete"
                    disabled={isPending}
                    className="min-h-10 rounded-xl px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Hapus
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
