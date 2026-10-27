"use client";

import { useState } from "react";
import { useActionState } from "react";
import { signOut } from "./login/actions";
import TaskManager from "./tasks/task-manager";
import SettingsForm from "./settings/settings-form";
import type { Task } from "../library/supabase/database.types";

const menuItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "My Task", icon: "task" },
  { label: "Settings", icon: "settings" },
] as const;

type MenuItem = (typeof menuItems)[number]["label"];

function MenuIcon({ name }: { name: (typeof menuItems)[number]["icon"] }) {
  if (name === "dashboard") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (name === "task") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="m8 12 2.5 2.5L16.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-1.3-3.1h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3.1l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3.1-1.3v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3.1h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" transform="translate(0 1)" />
    </svg>
  );
}

export default function Dashboard({
  email,
  fullName,
  tasks,
  todayDate,
  upcomingUntil,
}: {
  email: string;
  fullName: string | null;
  tasks: Task[];
  todayDate: string;
  upcomingUntil: string;
}) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Dashboard");
  const [logoutState, logoutAction, isLoggingOut] = useActionState(signOut, {
    error: null,
    message: null,
  });

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
        <a href="#" className="mb-7 flex items-center gap-3 md:mb-12" aria-label="TaskFlow home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            T
          </span>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </a>

        <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 md:block">
          Menu
        </p>
        <nav aria-label="Main navigation" className="flex gap-2 md:flex-col">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.label;

            return (
              <button
                key={item.label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveMenu(item.label)}
                className={`flex min-h-11 flex-1 items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors md:flex-none md:justify-start ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <MenuIcon name={item.icon} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 md:mt-auto">
          <p className="mb-3 truncate px-3 text-sm text-slate-500">{email}</p>
          <form action={logoutAction}>
            {logoutState.error && (
              <p role="alert" className="mb-3 px-3 text-sm text-red-600">
                {logoutState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoggingOut}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
                <path d="M16 17 21 12l-5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 5v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </form>
        </div>
      </aside>

      <section className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <p className="text-sm font-medium text-indigo-600">TaskFlow workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {activeMenu}
            </h1>
            <p className="mt-2 text-slate-500">
              {activeMenu === "Dashboard" && "Manage your tasks efficiently."}
              {activeMenu === "My Task" && "Your tasks will be organized here."}
              {activeMenu === "Settings" && "Manage your workspace preferences."}
            </p>
          </header>

          {activeMenu === "Dashboard" && (
            <DashboardOverview
              fullName={fullName}
              tasks={tasks}
              todayDate={todayDate}
              upcomingUntil={upcomingUntil}
              onViewTasks={() => setActiveMenu("My Task")}
            />
          )}

          {activeMenu === "My Task" && <TaskManager tasks={tasks} />}

          {activeMenu === "Settings" && (
            <SettingsForm email={email} fullName={fullName ?? ""} />
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardOverview({
  fullName,
  tasks,
  todayDate,
  upcomingUntil,
  onViewTasks,
}: {
  fullName: string | null;
  tasks: Task[];
  todayDate: string;
  upcomingUntil: string;
  onViewTasks: () => void;
}) {
  const statusCounts = {
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    done: tasks.filter((task) => task.status === "done").length,
  };
  const latestTasks = tasks.slice(0, 5);
  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.status !== "done" &&
        task.due_date !== null &&
        task.due_date >= todayDate &&
        task.due_date <= upcomingUntil,
    )
    .sort((left, right) =>
      (left.due_date ?? "").localeCompare(right.due_date ?? ""),
    )
    .slice(0, 5);
  const summaryCards = [
    { label: "Total tugas", value: tasks.length, tone: "text-indigo-700 bg-indigo-50" },
    { label: "Belum dikerjakan", value: statusCounts.todo, tone: "text-amber-700 bg-amber-50" },
    { label: "Sedang dikerjakan", value: statusCounts.inProgress, tone: "text-sky-700 bg-sky-50" },
    { label: "Selesai", value: statusCounts.done, tone: "text-emerald-700 bg-emerald-50" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">Ringkasan pekerjaan</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {fullName ? `Halo, ${fullName}` : "Ringkasan tugas Anda"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onViewTasks}
            className="min-h-10 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Kelola tugas
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className={`mt-4 inline-flex min-w-12 items-center justify-center rounded-xl px-3 py-2 text-2xl font-bold ${card.tone}`}>
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <TaskListCard
          title="Tugas terbaru"
          tasks={latestTasks}
          emptyMessage="Belum ada tugas. Tambahkan tugas pertama Anda."
          onViewTasks={onViewTasks}
        />
        <TaskListCard
          title="Mendekati tenggat"
          tasks={upcomingTasks}
          emptyMessage="Tidak ada tugas dengan tenggat dalam 7 hari ke depan."
          onViewTasks={onViewTasks}
          showDueDate
        />
      </div>
    </div>
  );
}

function TaskListCard({
  title,
  tasks,
  emptyMessage,
  onViewTasks,
  showDueDate = false,
}: {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  onViewTasks: () => void;
  showDueDate?: boolean;
}) {
  const statusLabels = {
    todo: "Belum dikerjakan",
    in_progress: "Sedang dikerjakan",
    done: "Selesai",
  };
  const priorityLabels = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onViewTasks}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Lihat semua
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {tasks.map((task) => (
            <li key={task.id} className="py-4 first:pt-1 last:pb-1">
              <p className="font-medium text-slate-900">{task.title}</p>
              {task.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {task.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{statusLabels[task.status]}</span>
                <span>Prioritas {priorityLabels[task.priority].toLowerCase()}</span>
                {showDueDate && task.due_date && (
                  <time dateTime={task.due_date}>
                    Tenggat{" "}
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeZone: "UTC",
                    }).format(new Date(`${task.due_date}T00:00:00.000Z`))}
                  </time>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
