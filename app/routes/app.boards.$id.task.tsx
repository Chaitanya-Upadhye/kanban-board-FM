import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { getSupabase } from "~/session";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      /* handle "POST" */
      const { id } = params;
      const formData = await request.formData();
      let title = formData.get("title");
      let description = formData.get("description");
      let col_id = formData.get("col_id");
      let subTasks = formData.getAll("subtasks").map((t) => {
        return {
          title: t,
          done: false,
        };
      });

      const { error } = await getSupabase({ request })
        .from("tasks")
        .insert({ title, description, board_id: id, col_id, subTasks });
      return { title, description, board_id: id, subTasks, error };
    }
    case "PUT": {
      /* handle "PUT" */
      const { id } = params;
      const formData = await request.formData();
      let taskId = formData.get("taskId");
      let title = formData.get("title");
      let description = formData.get("description");
      let col_id = formData.get("col_id");
      let subTasks = formData.getAll("subtasks").map((t) => {
        return {
          title: t,
          done: false,
        };
      });
      const { error } = await getSupabase({ request })
        .from("tasks")
        .update({ title, description, col_id, subTasks })
        .eq("id", taskId);
      return { title, description, board_id: id, error };
    }
    case "PATCH": {
      /* handle "PATCH" */
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};
