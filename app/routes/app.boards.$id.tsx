import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useFetchers,
  useLoaderData,
  useSubmit,
  Await,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useState, Suspense } from "react";
import { Button } from "~/components/Button";
import { EditBoardModal } from "~/components/EditBoardForm";
import { EditTaskModal } from "~/components/EditTaskForm";
import Header, { useWindowSize } from "~/components/layout/Header";
import { getSupabase, requireUserSession } from "~/session";
import { defer } from "@remix-run/node";
import Skeleton from "~/components/Skeleton";
import Sidebar, { ShowSidebarIcon } from "~/components/layout/Sidebar";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const supabase = getSupabase({ request });
  const tasksPromise = new Promise((resolve) => {
    supabase
      .from("tasks")
      .select(`*`)
      .eq("board_id", params.id)
      .then(resolve)
      .catch(resolve);
  });

  const boardPromise = new Promise((resolve) => {
    supabase
      .from("board")
      .select(`*,board_columns(id,title)`)
      .eq("id", params.id)
      .single()
      .then(resolve)
      .catch(resolve);
  });
  const userBoardsPromise = new Promise((resolve) => {
    supabase
      .from("board")
      .select()

      .then(resolve)
      .catch(resolve);
  });
  return defer({
    boardPromise,
    tasks: tasksPromise,
    userBoardsPromise,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id = 0 } = params;

  if (request?.method == "PUT") {
    const formData = await request.formData();

    let { title, totalColumns = 0, ...rest } = Object.fromEntries(formData);
    let columns = [];
    for (let i = 0; i < +totalColumns; i++) {
      columns.push({
        id: rest[`columns[${i}][id]`],
        title: rest[`columns[${i}][title]`],
        board_id: +id,
      });
    }
    const { data } = await getSupabase({ request })
      .from("board_columns")
      .select(`id,title,board_id`)
      .eq("board_id", +id);

    const newCols = columns?.filter((c) => c?.id === "new");
    const deletedCols = data?.filter(
      (c) => !columns?.find((col) => col?.id?.toString() === c?.id?.toString())
    );
    const updatedCols = columns?.filter((c) => c?.id !== "new");

    const { error: errorBoardupdate } = await getSupabase({ request })
      .from("board")
      .update({
        title,
      })
      .eq("id", +id);

    if (newCols?.length) {
      const { error: errorInsertCols } = await getSupabase({ request })
        .from("board_columns")
        .insert([...newCols?.map((c) => ({ title: c.title, board_id: +id }))]);
    }

    const { error: errorUpdateCols } = await getSupabase({ request })
      .from("board_columns")
      .upsert([...updatedCols]);

    if (deletedCols?.length) {
      const { error: errorDeleteCols } = await getSupabase({ request })
        .from("board_columns")
        .delete()
        .in("id", [...deletedCols?.map((c) => +c?.id)]);
    }
    return { title, board_id: id };
  }
  if (request.method === "DELETE") {
    const { error } = await getSupabase({ request })
      .from("board")
      .delete()
      .eq("id", +id);

    return {
      error,
    };
  }
  const formData = await request.formData();
  const taskDetails = JSON.parse(formData.get("taskDetails") as string);

  const { error } = await getSupabase({ request })
    .from("tasks")
    .update({ col_id: taskDetails?.targetCol })
    .eq("id", taskDetails?.id);
  if (error) console.log(error);
  return json({ error });
}

function usePendingItems() {
  const pendingItems = useFetchers()
    ?.filter((f) => f.state === "submitting")
    .map((f) => JSON.parse(f.formData?.get("taskDetails") as string));
  return pendingItems;
}

function BoardHome() {
  let { boardPromise, tasks, userBoardsPromise } = useLoaderData();
  const { width } = useWindowSize();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const { supabase } = useOutletContext();
  const submit = useSubmit();
  const [openAddColModal, setOpenAddColModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-full">
        <aside
          data-active={isActive}
          className={`col-start-1 w-[300px] row-span-full border-r  border-r-linesLight  rounded-sm transition-all 
       invisible sm:visible
        `}
        >
          <Suspense fallback={<Skeleton />}>
            <Await resolve={userBoardsPromise}>
              {({ data }) => {
                return (
                  <Sidebar
                    boards={data}
                    isActive={isActive}
                    setIsActive={setIsActive}
                  />
                );
              }}
            </Await>
          </Suspense>
        </aside>

        <main className="max-h-[100vh] overflow-y-hidden row-span-full ">
          <Suspense fallback={<Skeleton />}>
            <Await resolve={boardPromise}>
              {({ data: board }) => (
                <>
                  <header className=" col-start-2 col-span-1">
                    <Suspense fallback={<Skeleton />}>
                      <Await resolve={userBoardsPromise}>
                        {({ data }) => {
                          return (
                            <Header
                              cols={board?.board_columns}
                              title={board?.title}
                              board={board}
                              isActive={isActive}
                              setIsActive={setIsActive}
                              supabase={supabase}
                              userBoards={data}
                            />
                          );
                        }}
                      </Await>
                    </Suspense>
                  </header>
                  <div
                    className={`flex gap-4 h-[90%] overflow-x-auto p-6 overflow-y-hidden bg-lightGreyLightBg`}
                  >
                    {board?.board_columns?.map((col) => {
                      return (
                        <div
                          key={col.title}
                          className="min-w-[280px]"
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();

                            const data = JSON.parse(
                              e.dataTransfer.getData("text/plain")
                            );
                            if (data.col_id == col.id) return;

                            submit(
                              {
                                taskDetails: JSON.stringify({
                                  ...data,
                                  targetCol: col.id,
                                }),
                              },
                              {
                                method: "post",
                                navigate: false,
                                fetcherKey: data?.id,
                              }
                            );
                          }}
                        >
                          <span className="  flex gap-4 items-center">
                            <span className="w-3 h-3 rounded-full bg-mainPurple block "></span>{" "}
                            <span className="text-heading-s text-mediumGrey">
                              {col.title?.toUpperCase()}
                            </span>
                          </span>
                          <div className="flex flex-col gap-[20px] mt-6 max-h-[80vh]  overflow-auto pr-1">
                            <Suspense fallback={<Skeleton />} key={id}>
                              <Await resolve={tasks}>
                                {(tasksResolved) => (
                                  <TaskList
                                    col={col}
                                    cols={board?.board_columns}
                                    tasks={tasksResolved?.data}
                                  />
                                )}
                              </Await>
                            </Suspense>
                          </div>
                        </div>
                      );
                    })}
                    {!board?.board_columns?.length ? (
                      <div className="flex items-center justify-center w-full">
                        <section className="flex flex-col items-center justify-center gap-4">
                          <span className="text-heading-l text-mediumGrey text-center">
                            This board is empty. Create a new column to get
                            started.
                          </span>
                          <Button
                            onClick={() => setOpenAddColModal(true)}
                            size={"lg"}
                            variant={"primary"}
                          >
                            <span className="text-heading-m text-[#fff]">
                              + Add New Column
                            </span>
                          </Button>
                        </section>
                      </div>
                    ) : (
                      <div
                        id="new-col"
                        className=" mt-10 rounded-md min-w-[280px] bg-[#e9effa] text-center px-14 cursor-pointer flex items-center justify-center "
                        onClick={() => setOpenAddColModal(true)}
                      >
                        <p className="text-heading-xl text-mediumGrey">
                          {" "}
                          + New Column
                        </p>
                      </div>
                    )}

                    {openAddColModal ? (
                      <EditBoardModal
                        open={openAddColModal}
                        setOpen={setOpenAddColModal}
                        editedBoard={board}
                      />
                    ) : null}
                  </div>
                </>
              )}
            </Await>
          </Suspense>
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
const TaskList = ({ col, cols, tasks }) => {
  console.log(tasks, "tasks");
  const [open, setOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const pendingItems = usePendingItems();
  function getReconciledTasks() {
    for (let task of tasks) {
      let pendingTask = pendingItems.find((t) => t?.id === task.id);
      if (pendingTask) {
        task.col_id = pendingTask?.targetCol;
        continue;
      }
    }
    return tasks;
  }
  return (
    <>
      {getReconciledTasks()
        ?.filter((t) => {
          if (t?.targetCol) return t.targetCol === col.id;
          return t.col_id == col.id;
        })
        .map((t) => {
          return (
            <Task
              key={t?.id}
              task={t}
              onClick={() => {
                setOpen(true);
                setEditedTask(t);
              }}
            ></Task>
          );
        })}
      {open ? (
        <EditTaskModal
          open={open}
          setOpen={setOpen}
          cols={cols}
          editedTask={editedTask}
          isBeingEdited={false}
        ></EditTaskModal>
      ) : null}
    </>
  );
};

const Task = ({ task, onClick = () => {} }) => {
  const taskFetcher = useFetchers().find((f) => f.key === task.id);
  return (
    <>
      <div
        draggable
        className={`transition-all bg-white rounded-lg group  px-4 py-6 shadow-mds font-normal text-black hover:cursor-grab min-h-[88px] shadow-task-card
      ${
        taskFetcher?.state === "submitting"
          ? "  bg-slate-300 text-slate-400"
          : ""
      }
        `}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", JSON.stringify(task));
          e.dataTransfer.dropEffect = "move";
        }}
        key={task?.id}
        onClick={onClick}
      >
        <span className="text-heading-m group-hover:text-mainPurple">
          {task?.title}
        </span>
        <span className="text-mediumGrey  text-body-m block pt-2">
          {task?.subTasks?.length
            ? `${task?.subTasks?.filter((t) => t?.done === true)?.length} of ${
                task?.subTasks?.length
              } subtasks`
            : "0 subtasks"}
        </span>
      </div>
    </>
  );
};

export default BoardHome;
