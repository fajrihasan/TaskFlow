"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../library/supabase/server";

export type TaskActionState = {
  error: string | null;
  message: string | null;
};

const initialTaskActionState: TaskActionState = {
  error: null,
  message: null,
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidTaskId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

function isValidStatus(status: string): status is "todo" | "in_progress" | "done" {
  return status === "todo" || status === "in_progress" || status === "done";
}

function isValidPriority(
  priority: string,
): priority is "low" | "medium" | "high" {
  return priority === "low" || priority === "medium" || priority === "high";
}

function isValidDueDate(dueDate: string) {
  if (!dueDate) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return false;
  }

  const parsedDate = new Date(`${dueDate}T00:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === dueDate;
}

export async function saveTask(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const intent = getText(formData, "intent");
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && authError.name !== "AuthSessionMissingError") {
    return { error: authError.message, message: null };
  }

  if (!user) {
    return {
      error: "Sesi Anda berakhir. Silakan masuk kembali.",
      message: null,
    };
  }

  const taskId = getText(formData, "taskId");

  if (intent === "create" || intent === "update") {
    const title = getText(formData, "title");
    const description = getText(formData, "description");
    const status = getText(formData, "status");
    const priority = getText(formData, "priority");
    const dueDate = getText(formData, "dueDate");

    if (!title || title.length > 200) {
      return {
        error: "Judul tugas wajib diisi dan maksimal 200 karakter.",
        message: null,
      };
    }

    if (description.length > 5000) {
      return {
        error: "Deskripsi tugas maksimal 5.000 karakter.",
        message: null,
      };
    }

    if (!isValidStatus(status) || !isValidPriority(priority)) {
      return { error: "Status atau prioritas tugas tidak valid.", message: null };
    }

    if (!isValidDueDate(dueDate)) {
      return { error: "Tanggal tenggat tidak valid.", message: null };
    }

    if (intent === "create") {
      const { error } = await supabase.from("tasks").insert({
        title,
        description: description || null,
        status,
        priority,
        due_date: dueDate || null,
        user_id: user.id,
      });

      if (error) {
        return { error: error.message, message: null };
      }

      revalidatePath("/");
      return { ...initialTaskActionState, message: "Tugas berhasil dibuat." };
    }

    if (!isValidTaskId(taskId)) {
      return { error: "Tugas tidak ditemukan.", message: null };
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title,
        description: description || null,
        status,
        priority,
        due_date: dueDate || null,
      })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return { error: error.message, message: null };
    }

    if (!data) {
      return {
        error: "Tugas tidak ditemukan atau tidak dapat diakses.",
        message: null,
      };
    }

    revalidatePath("/");
    return { ...initialTaskActionState, message: "Tugas berhasil diperbarui." };
  }

  if (intent === "delete") {
    if (!isValidTaskId(taskId)) {
      return { error: "Tugas tidak ditemukan.", message: null };
    }

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return { error: error.message, message: null };
    }

    if (!data) {
      return {
        error: "Tugas tidak ditemukan atau tidak dapat diakses.",
        message: null,
      };
    }

    revalidatePath("/");
    return { ...initialTaskActionState, message: "Tugas berhasil dihapus." };
  }

  return { error: "Operasi tugas tidak valid.", message: null };
}
