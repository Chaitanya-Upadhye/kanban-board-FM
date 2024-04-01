import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useWindowSize } from "~/components/layout/Header";

import Sidebar, { ShowSidebarIcon } from "~/components/layout/Sidebar";
import type { Database } from "~/db/types/db-types";
import { requireUserSession, getSupabase } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const supabase: SupabaseClient = getSupabase({ request });
  const { data } = await supabase.from("board").select();

  if (data?.length && !request?.url.includes("/app/boards"))
    throw redirect(`/app/boards/${data?.at(0)?.id}`);
  return json(data);
}

function App() {
  const userBoards = useLoaderData<typeof loader>();
  const { width } = useWindowSize();
  const [isActive, setIsActive] = useState(true);

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-full">
        {/* <header className=" col-start-2 col-span-1">
        {" "}
        <Header />{" "}
      </header> */}
        <aside
          className={`col-start-1 w-[300px] row-span-full border-r  border-r-linesLight  rounded-sm transition-all ${
            !isActive ? "ml-[-300px]  " : ""
          }`}
        >
          <Sidebar
            boards={userBoards}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </aside>

        <main className="max-h-[100vh] overflow-y-hidden row-span-full ">
          <Outlet context={{ isActive, setIsActive, userBoards }}></Outlet>
        </main>
        {/* <footer className="h-14 bg-slate-700 text-slate-50 col-start-2 col-span-1">
        Footer
      </footer> */}
      </div>
      {!isActive && width > 576 ? (
        <div
          onClick={() => setIsActive(true)}
          className="absolute bottom-8 bg-mainPurple rounded-r-3xl cursor-pointer "
        >
          <ShowSidebarIcon className="ml-4 my-5 mr-4" />
        </div>
      ) : null}
    </>
  );
}

export default App;
