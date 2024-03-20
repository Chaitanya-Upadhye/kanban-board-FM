import { useFetcher, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Modal from "./Modal";

import { Input } from "./Input";
import { Button } from "./Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Checkbox } from "./Checkbox";

function EditTaskForm({
  defaultValues = { title: "", description: "", col_id: "", id: "" },
  cols,
  fetcher,
}) {
  let { title, description, col_id, id: taskId } = defaultValues;
  const [subTasks, setSubTasks] = useState(defaultValues?.subTasks || []);
  // Function to handle subtask change
  const handleSubtaskChange = (index, event) => {
    const newSubtasks = [...subTasks];
    newSubtasks[index] = event.target.value;
    setSubTasks(newSubtasks);
  };

  // Function to add a new subtask field
  const addSubtask = () => {
    setSubTasks([...subTasks, ""]);
  };

  const { id } = useParams();
  return (
    <fetcher.Form method="PUT" className="" action={`/app/boards/${id}/task`}>
      <div className="relative z-0 w-full mb-5 group py-4">
        <input type="hidden" name="taskId" defaultValue={taskId} />
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={title}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="title"
          className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Title
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="description"
          id="description"
          defaultValue={description}
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="description"
          className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Description
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group py-4">
        {subTasks.map((subTask, idx) => {
          return (
            <div className="relative z-0 w-full mb-5 group py-4" key={idx}>
              <input
                type="text"
                name={`subtasks`}
                id={`subtasks[${idx}]`}
                required
                value={subTask?.title}
                onChange={(e) => handleSubtaskChange(idx, e)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
          );
        })}
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={addSubtask}
        >
          Add subtask
        </button>
        <label
          htmlFor="subtasks"
          className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Subtasks
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <select name={"col_id"} defaultValue={col_id}>
          {cols?.map((col) => {
            let { title = "", id } = col;
            return (
              <option key={id} value={id}>
                {title}
              </option>
            );
          })}
        </select>
      </div>

      <button
        type="submit"
        className="text-white bg-mainPurple  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </fetcher.Form>
  );
}

export default EditTaskForm;

export const EditTaskModal = ({ open, setOpen, editedTask, cols }) => {
  const fetcher = useFetcher();
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [subTasks, setSubTasks] = useState(editedTask?.subTasks);
  const isDone = fetcher.state === "idle" && fetcher.data != null;

  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Content title={!isBeingEdited ? editedTask?.title : "Edit task"}>
        {isBeingEdited ? (
          <EditTaskForm
            defaultValues={editedTask}
            cols={cols}
            fetcher={fetcher}
          />
        ) : (
          <>
            <p className="mt-6 text-mediumGrey text-body-l">
              {/* {editedTask?.description} */}
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est
              saepe aperiam, maxime asperiores distinctio, aspernatur hic
              voluptates nam aut, cupiditate architecto. Nihil quia commodi
              fuga, impedit harum error eligendi omnis.
            </p>
            <section className="mt-6">
              <span className="text-body-m text-mediumGrey">
                Subtasks (2 of 3)
              </span>
              <ul className="mt-4 flex flex-col gap-2">
                {subTasks?.map((t) => {
                  return (
                    <li
                      key={t?.title}
                      onClick={() => {
                        setSubTasks((prevSubTasks) =>
                          prevSubTasks.map((st) =>
                            st.title === t.title
                              ? { ...st, done: !st.done }
                              : st
                          )
                        );
                      }}
                      className="cursor-pointer rounded hover:bg-mainPurple/30 bg-lightGreyLightBg flex items-center p-3 text-body-m text-mediumGrey line-through decoration-mediumGrey decoration-[0.5px] decoration-solid  gap-4"
                    >
                      <Checkbox id="subTasks" checked={t?.done} />
                      <label htmlFor="subTasks" className="">
                        {t?.title}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6">
                <label htmlFor="col_id" className="text-body-m text-mediumGrey">
                  Current Status
                </label>
                <Select
                  name="col_id"
                  defaultValue={editedTask?.col_id?.toString()}
                  className="mt-2"
                >
                  <SelectTrigger className="w-full outline-none focus:outline-none">
                    <SelectValue className="focus:outline-none text-heading-l" />
                  </SelectTrigger>
                  <SelectContent>
                    {cols?.map((col) => {
                      return (
                        <SelectItem key={col?.id} value={col?.id?.toString()}>
                          {col?.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </section>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};

export const AddTaskModal = ({ open, setOpen, cols }) => {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [subTasks, setSubTasks] = useState([]);
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  // Function to handle subtask change
  const handleSubtaskChange = (index, event) => {
    const newSubtasks = [...subTasks];
    newSubtasks[index] = event.target.value;
    setSubTasks(newSubtasks);
  };

  // Function to add a new subtask field
  const addSubtask = (e) => {
    e.preventDefault();
    setSubTasks([...subTasks, ""]);
  };

  // Function to remove a subtask field
  const removeSubtask = (index) => {
    const newSubtasks = [...subTasks];
    newSubtasks.splice(index, 1);
    setSubTasks(newSubtasks);
  };
  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Content title="Edit Task">
        <fetcher.Form
          method="post"
          className="w-full"
          action={`/app/boards/${id}/task`}
        >
          <div className="my-6">
            <Input
              label={"Title"}
              type="text"
              name="title"
              id="title"
              required
            />
          </div>
          <div className="my-6">
            <Input
              label={"Description"}
              type="text"
              name="description"
              id="description"
              required
            />
          </div>

          <div className="my-6">
            {subTasks.length ? (
              <label
                htmlFor="subtasks"
                className="block text-mediumGrey text-body-m mb-2"
              >
                Subtasks
              </label>
            ) : null}
            {subTasks.map((subTask, idx) => {
              return (
                <div
                  className="flex gap-4 items-center justify-between z-0 w-full my-3"
                  key={idx}
                >
                  <div className="flex-grow">
                    {" "}
                    <Input
                      type="text"
                      className="w-full "
                      name={`subtasks`}
                      id={`subtasks[${idx}]`}
                      required
                      value={subTask}
                      onChange={(e) => handleSubtaskChange(idx, e)}
                    />
                  </div>
                  <svg
                    className="cursor-pointer  hover:fill-red fill-mediumGrey"
                    width="15"
                    height="15"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => removeSubtask(idx)}
                  >
                    <g fill-rule="evenodd">
                      <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                      <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                    </g>
                  </svg>
                </div>
              );
            })}

            <Button
              variant="secondary"
              size={"sm"}
              onClick={addSubtask}
              className="w-full text-center mb-6"
            >
              + Add New Subtask
            </Button>
          </div>
          <div className="my-6">
            <label
              htmlFor="col_id"
              className="block text-mediumGrey text-body-m mb-2"
            >
              Status
            </label>
            <Select name="col_id" defaultValue={cols.at(0)?.id?.toString()}>
              <SelectTrigger className="w-full outline-none focus:outline-none">
                <SelectValue className="focus:outline-none text-heading-l" />
              </SelectTrigger>
              <SelectContent>
                {cols?.map((col) => {
                  return (
                    <SelectItem key={col?.id} value={col?.id?.toString()}>
                      {col?.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            // onClick={fetcher.submit}
            disabled={fetcher.state !== "idle"}
            variant={"primary"}
            className="w-full"
            size={"sm"}
          >
            Create Task
          </Button>
        </fetcher.Form>
      </Modal.Content>
    </Modal>
  );
};
