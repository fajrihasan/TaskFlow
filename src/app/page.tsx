"use client";

import { useState } from "react";

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

export default function Home() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Dashboard");

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

        <button className="mt-auto hidden rounded-2xl bg-red-500 hover:bg-red-600 p-4 md:block text-sm font-medium" onClick={() => console.log("Logout clicked")}>
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
              <path d="M16 17 21 12l-5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Logout
          </div>
        </button>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <MenuIcon name="dashboard" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Welcome to your dashboard
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Use the menu to view your tasks or update your settings.
              </p>
            </div>
          )}

          {activeMenu === "My Task" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">My Task</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                You don&apos;t have any tasks to display yet.
              </p>
            </div>
          )}

          {activeMenu === "Settings" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your workspace settings will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
