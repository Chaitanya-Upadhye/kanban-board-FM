import * as Dialog from "@radix-ui/react-dialog";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useFetcher,
  useFetchers,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { EditBoardModal } from "~/components/EditBoardForm";
import { EditTaskModal } from "~/components/EditTaskForm";
import Modal from "~/components/Modal";
import Header from "~/components/layout/Header";
import { getSupabase, requireUserSession } from "~/session";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const { data } = await getSupabase({ request })
    .from("board")
    .select()
    .eq("id", params.id)
    .single();
  const { data: boardDetails } = await getSupabase({ request })
    .from("board_columns")
    .select(`id,title`)
    .eq("board_id", params.id);
  const { data: tasks } = await getSupabase({ request })
    .from("tasks")
    .select(`*`)
    .eq("board_id", params.id);

  return json({
    board: { ...data, columns: boardDetails },
    tasks,
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
  let { board, tasks = [] } = useLoaderData();
  const submit = useSubmit();
  const [openAddColModal, setOpenAddColModal] = useState(false);
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
      <header className=" col-start-2 col-span-1">
        {" "}
        <Header cols={board?.columns} title={board?.title} board={board} />{" "}
      </header>
      <div
        className={`flex gap-4 h-[90%] overflow-x-auto p-6 overflow-y-hidden bg-lightGreyLightBg`}
      >
        {console.log(board.columns, "cols")}
        {board?.columns?.map((col) => {
          return (
            <div
              key={col.title}
              className="min-w-[280px]"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();

                const data = JSON.parse(e.dataTransfer.getData("text/plain"));
                if (data.col_id == col.id) return;

                submit(
                  {
                    taskDetails: JSON.stringify({ ...data, targetCol: col.id }),
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
              <div className="flex flex-col gap-[20px] mt-6 max-h-[80vh] hover:overflow-y-auto overflow-y-hidden pr-1">
                <TaskList
                  tasksState={[...getReconciledTasks()]}
                  col={col}
                  cols={board?.columns}
                />
              </div>
            </div>
          );
        })}
        {!board?.columns?.length ? (
          <div className="flex items-center justify-center w-full">
            <section className="flex flex-col items-center justify-center gap-4">
              <span className="text-heading-l text-mediumGrey">
                This board isempty. Create a new column to get started.
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
        ) : null}
        <div
          id="new-col"
          className=" rounded-md min-w-[280px] bg-[#e9effa] text-center px-14 cursor-pointer flex items-center justify-center "
          onClick={() => setOpenAddColModal(true)}
        >
          <p className="text-heading-xl text-mediumGrey"> + New Column</p>
        </div>
        {openAddColModal ? (
          <EditBoardModal
            open={openAddColModal}
            setOpen={setOpenAddColModal}
            editedBoard={board}
          />
        ) : null}
      </div>
    </>
  );
}
const TaskList = ({ tasksState, col, cols }) => {
  const [open, setOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  return (
    <>
      {tasksState
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
        className={`bg-white rounded-lg group  px-4 py-6 shadow-mds font-normal text-black hover:cursor-grab min-h-[88px] shadow-task-card
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
