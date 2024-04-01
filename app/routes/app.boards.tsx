import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { getSession, getSupabase } from "~/session";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      let title = formData.get("title");

      const { data } = await getSupabase({ request }).from("org").select();
      const { data: boardInsert, error: insertBoardError } = await getSupabase({
        request,
      })
        .from("board")
        .insert({ title, org_id: data?.at(0)?.id }, { returning: "minimal" });
      const { data: board, error: selectBoardError } = await getSupabase({
        request,
      })
        .from("board")
        .select()
        .order("created_at", { ascending: false })
        .eq("title", title)
        .eq("org_id", data?.at(0)?.id);

      let columns = formData.getAll("columns").map((t) => {
        return {
          title: t,
          board_id: board?.at(0)?.id,
        };
      });

      const { error } = await getSupabase({ request })
        .from("board_columns")
        .insert(columns);
      return { error };
    }
  }
};
