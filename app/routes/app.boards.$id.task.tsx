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
          id: new Date().getTime(),
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

      let {
        taskId,
        title,
        description,
        totalSubtasks = 0,
        col_id,
        ...rest
      } = Object.fromEntries(formData);
      let subTasks = [];
      for (let i = 0; i < +totalSubtasks; i++) {
        subTasks.push({
          title: rest[`subtasks[${i}][title]`],
          done: rest[`subtasks[${i}][done]`] === "true",
          id: new Date().getTime(),
        });
      }

      const { error } = await getSupabase({ request })
        .from("tasks")
        .update({
          title,
          description,
          col_id,
          ...(subTasks.length > 0 && { subTasks }),
        })
        .eq("id", taskId);
      return { title, description, board_id: id, error };
    }
    case "PATCH": {
      /* handle "PATCH" */
      // const { id } = params;
      const formData = await request.formData();
      let taskId = formData.get("taskId");

      let updatedSubtasks = JSON.parse(
        formData.get("updatedSubtasks") as string
      );
      const { error } = await getSupabase({ request })
        .from("tasks")
        .update({
          subTasks: updatedSubtasks,
        })
        .eq("id", taskId);

      return {
        error,
      };
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};
