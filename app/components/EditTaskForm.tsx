import {
  useFetcher,
  useLoaderData,
  useParams,
  useSubmit,
} from "@remix-run/react";
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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const EditTaskModal = ({ open, setOpen, editedTask, cols }) => {
  const fetcher = useFetcher();
  const { id } = useParams();
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [subTasks, setSubTasks] = useState(editedTask?.subTasks);
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  const submit = useSubmit();
  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Content>
        <Modal.Title>
          {!isBeingEdited ? (
            <div className="flex justify-between items-center">
              <h2 className="text-heading-l text-black">{editedTask?.title}</h2>{" "}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    className="cursor:pointer"
                    aria-label="Customise options"
                  >
                    <svg
                      width="5"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="#828FA3" fill-rule="evenodd">
                        <circle cx="2.308" cy="2.308" r="2.308" />
                        <circle cx="2.308" cy="10" r="2.308" />
                        <circle cx="2.308" cy="17.692" r="2.308" />
                      </g>
                    </svg>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[100px] p-4 bg-white rounded-md  shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                    sideOffset={1}
                  >
                    <DropdownMenu.Item
                      onSelect={() => {
                        setIsBeingEdited(true);
                      }}
                      className="mb-4 group cursor-pointer text-body-l text-mediumGrey leading-none text-slate-700 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-blue-300"
                    >
                      Edit Task
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="cursor-pointer group text-body-l text-red text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500">
                      Delete Task
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ) : (
            <span className="text-heading-l text-black  ">Edit Task</span>
          )}
        </Modal.Title>
        {isBeingEdited ? (
          <EditTaskForm
            editedTask={editedTask}
            cols={cols}
            setOpen={setOpen}
            fetcher={fetcher}
          />
        ) : (
          <>
            <p className="mt-6 text-mediumGrey text-body-l">
              {editedTask?.description}
            </p>
            <section className="mt-6">
              <span className="text-body-m text-mediumGrey">
                {` Subtasks (${subTasks.filter((t) => t.done).length} of ${
                  subTasks.length
                }) `}
              </span>
              <ul className="mt-4 flex flex-col gap-2">
                {subTasks?.map((t) => {
                  return (
                    <li
                      key={t?.title}
                      onClick={() => {
                        setSubTasks((prevSubTasks) => {
                          let updatedSubtasks = prevSubTasks.map((st) =>
                            st.title === t.title
                              ? { ...st, done: !st.done }
                              : st
                          );
                          submit(
                            {
                              taskId: editedTask?.id,
                              updatedSubtasks: JSON.stringify(updatedSubtasks),
                            },
                            {
                              method: "patch",
                              action: `/app/boards/${id}/task`,
                              navigate: false,
                              fetcherKey: t?.title,
                            }
                          );

                          return updatedSubtasks;
                        });
                      }}
                      className={`cursor-pointer rounded hover:bg-mainPurple/30 bg-lightGreyLightBg flex items-center p-3 text-body-m ${
                        t?.done ? `text-mediumGrey line-through` : `text-black`
                      } decoration-mediumGrey decoration-[0.5px] decoration-solid  gap-4`}
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
                  className="mt-2 active:bordere-mainPurple active:ring-1 active:ring-mainPurple"
                  onValueChange={(e) => {
                    submit(
                      {
                        ...(editedTask || {}),
                        taskId: editedTask?.id,
                        subTasks: JSON.stringify(editedTask?.subTasks),
                        col_id: e,
                      },
                      {
                        method: "put",
                        action: `/app/boards/${id}/task`,
                        navigate: false,
                        fetcherKey: e,
                      }
                    );
                  }}
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
      <Modal.Content>
        <Modal.Title>
          <>
            <span className="text-heading-l text-black  ">Add Task</span>
          </>
        </Modal.Title>
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
              type="text-area"
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

export const EditTaskForm = ({ setOpen, cols, editedTask }) => {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [subTasks, setSubTasks] = useState([...(editedTask?.subTasks || [])]);
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  // Function to handle subtask change
  const handleSubtaskChange = (index, event) => {
    const newSubtasks = [...subTasks];
    newSubtasks[index].title = event.target.value;
    setSubTasks(newSubtasks);
  };

  // Function to add a new subtask field
  const addSubtask = (e) => {
    e.preventDefault();
    setSubTasks([...subTasks, { title: "", done: false }]);
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
    <fetcher.Form
      method="put"
      className="w-full"
      action={`/app/boards/${id}/task`}
    >
      <div className="my-6">
        <Input type="hidden" name={`totalSubtasks`} value={subTasks?.length} />
        <Input type="hidden" name={`taskId`} value={editedTask?.id} />

        <Input
          defaultValue={editedTask?.title}
          label={"Title"}
          type="text"
          name="title"
          id="title"
          required
        />
      </div>
      <div className="my-6">
        <Input
          defaultValue={editedTask?.description}
          label={"Description"}
          type="text-area"
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
                  type="hidden"
                  name={`subtasks[${idx}][done]`}
                  value={subTask?.done}
                />
                <Input
                  type="text"
                  className="w-full "
                  name={`subtasks[${idx}][title]`}
                  id={`subtasks[${idx}]`}
                  required
                  value={subTask?.title}
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
        <Select name="col_id" defaultValue={editedTask?.col_id?.toString()}>
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
        disabled={fetcher.state !== "idle"}
        variant={"primary"}
        className="w-full"
        size={"sm"}
      >
        Save Changes
      </Button>
    </fetcher.Form>
  );
};
