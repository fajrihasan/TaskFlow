export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          created_at: string;
          description: string | null;
          due_date: string | null;
          id: string;
          priority: "low" | "medium" | "high";
          status: "todo" | "in_progress" | "done";
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: "low" | "medium" | "high";
          status?: "todo" | "in_progress" | "done";
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          priority?: "low" | "medium" | "high";
          status?: "todo" | "in_progress" | "done";
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Task = Pick<
  Database["public"]["Tables"]["tasks"]["Row"],
  "created_at" | "description" | "due_date" | "id" | "priority" | "status" | "title"
>;
