import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "../library/supabase/server";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <AuthenticatedHome />
    </Suspense>
  );
}

async function AuthenticatedHome() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }

  if (!user) {
    redirect("/login");
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, title, description, status, priority, due_date, created_at")
    .order("created_at", { ascending: false });

  if (tasksError) {
    throw tasksError;
  }

  const fullName = user.user_metadata.full_name;
  const todayDate = new Date().toISOString().slice(0, 10);
  const endOfUpcomingWindow = new Date(`${todayDate}T00:00:00.000Z`);
  endOfUpcomingWindow.setUTCDate(endOfUpcomingWindow.getUTCDate() + 7);

  return (
    <Dashboard
      email={user.email ?? ""}
      fullName={typeof fullName === "string" ? fullName : null}
      tasks={tasks}
      todayDate={todayDate}
      upcomingUntil={endOfUpcomingWindow.toISOString().slice(0, 10)}
    />
  );
}

function DashboardFallback() {
  return (
    <main
      role="status"
      className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-sm text-slate-500"
    >
      Loading your workspace...
    </main>
  );
}
