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
        {/* <div
          className=" rounded-md min-w-[250px] text-center p-4 border border-dashed border-slate-500 cursor-pointer "
          onClick={() => setOpenAddColModal(true)}
        >
          <p className="mt-auto mb-auto"> + New Column</p>
        </div> */}
        {openAddColModal ? (
          <AddColModal open={openAddColModal} setOpen={setOpenAddColModal} />
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
        className={`bg-white rounded-lg group  px-4 py-6 shadow-mds font-normal text-lg hover:cursor-grab min-h-[88px] shadow-task-card
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
const AddColModal = ({ open, setOpen }) => {
  const fetcher = useFetcher();
  const { id } = useParams();
  const [columns, setColumns] = useState([]);
  const handleColChange = (index, event) => {
    const newCols = [...columns];
    newCols[index] = event.target.value;
    setColumns(newCols);
  };

  const addCols = () => {
    setColumns([...columns, ""]);
  };
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            {" "}
            <h2 className="text-lg font-semibold">Add Column</h2>
          </Modal.Header>
          <fetcher.Form method="post" action={`/app/boards/${id}/col`}>
            <div className="relative z-0 w-full mb-5 group py-4">
              <input type="hidden" name="taskId" defaultValue={""} />
              {columns.map((c, idx) => {
                return (
                  <input
                    key={idx}
                    type="text"
                    name="column"
                    id="column"
                    defaultValue={""}
                    onChange={(e) => handleColChange(idx, e)}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={c}
                    required
                  />
                );
              })}
              <label
                htmlFor="column"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Column
              </label>
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={addCols}
              >
                Add columns
              </button>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </fetcher.Form>
        </Modal.Content>
      </Modal>
    </>
  );
};
export default BoardHome;
