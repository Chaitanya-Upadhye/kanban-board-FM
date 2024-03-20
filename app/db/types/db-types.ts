export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      board: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          org_id: number | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          org_id?: number | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          org_id?: number | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "board_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "org";
            referencedColumns: ["id"];
          }
        ];
      };
      org: {
        Row: {
          created_at: string;
          id: number;
          owner: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          owner?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          owner?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "org_owner_fkey";
            columns: ["owner"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      org_profile_role: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          id: number;
          org_id: number | null;
          role_id: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          org_id?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          org_id?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "org_profile_role_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "org";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "org_profile_role_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "org_profile_role_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      permission: {
        Row: {
          action: string | null;
          created_at: string;
          deleted_at: string | null;
          id: number;
          object: string | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          action?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          object?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          action?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          object?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      role: {
        Row: {
          active: boolean | null;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: number;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      role_permission: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          id: number;
          permission_id: number | null;
          role_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          permission_id?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          id?: number;
          permission_id?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "role_permission_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permission";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "role_permission_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["id"];
          }
        ];
      };
      status: {
        Row: {
          board_id: string | null;
          created_at: string;
          id: number;
          value: string | null;
        };
        Insert: {
          board_id?: string | null;
          created_at?: string;
          id?: number;
          value?: string | null;
        };
        Update: {
          board_id?: string | null;
          created_at?: string;
          id?: number;
          value?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          board_id: number | null;
          created_at: string;
          description: string | null;
          id: number;
          status: number | null;
          subTasks: Json | null;
          title: string | null;
        };
        Insert: {
          board_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          status?: number | null;
          subTasks?: Json | null;
          title?: string | null;
        };
        Update: {
          board_id?: number | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          status?: number | null;
          subTasks?: Json | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_board_id_fkey";
            columns: ["board_id"];
            isOneToOne: false;
            referencedRelation: "board";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
