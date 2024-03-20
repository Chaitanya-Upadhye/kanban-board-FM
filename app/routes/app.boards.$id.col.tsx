import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { getSupabase } from "../session";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      /* handle "POST" */
      const { id } = params;
      const formData = await request.formData();
      const allCols = formData.getAll("column");

      const { error } = await getSupabase({ request })
        .from("board_columns")
        .insert(
          allCols.map((col) => {
            return {
              title: col,
              board_id: id,
            };
          })
        );
      return { error };
    }
    case "PUT": {
      /* handle "PUT" */
    }
    case "PATCH": {
      /* handle "PATCH" */
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};
