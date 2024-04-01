import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { getSupabase, requireUserSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  return json([]);
}

export async function action({ request }: { request: Request }) {
  return {};
}
function AppIndex() {
  return <></>;
}

export default AppIndex;
