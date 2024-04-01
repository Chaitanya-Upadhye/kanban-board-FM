import { useFetcher, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Modal from "./Modal";

import { Input } from "./Input";
import { Button } from "./Button";

export const EditBoardModal = ({ open, setOpen, editedBoard }) => {
  const fetcher = useFetcher();
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Content>
        <Modal.Title>
          <span className="text-heading-l text-black  ">Edit Board</span>
        </Modal.Title>
        <EditBoardForm editedBoard={editedBoard} setOpen={setOpen} />
      </Modal.Content>
    </Modal>
  );
};
export const AddBoardModal = ({ open, setOpen }) => {
  const fetcher = useFetcher();
  const [columns, setColumns] = useState([]);
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  // Function to handle subtask change
  const handleColumnsChange = (index, event) => {
    const newColumns = [...columns];
    newColumns[index] = event.target.value;
    setColumns(newColumns);
  };

  // Function to add a new subtask field
  const addColumn = (e) => {
    e.preventDefault();
    setColumns([...columns, ""]);
  };

  // Function to remove a subtask field
  const removeColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
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
            <span className="text-heading-l text-black ">Create Board</span>
          </>
        </Modal.Title>
        <fetcher.Form method="post" className="w-full" action={`/app/boards`}>
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
            {columns.length ? (
              <label
                htmlFor="columns"
                className="block text-mediumGrey text-body-m mb-2"
              >
                Columns
              </label>
            ) : null}
            {columns.map((column, idx) => {
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
                      name={`columns`}
                      id={`columns[${idx}]`}
                      required
                      value={column}
                      onChange={(e) => handleColumnsChange(idx, e)}
                    />
                  </div>
                  <svg
                    className="cursor-pointer  hover:fill-red fill-mediumGrey"
                    width="15"
                    height="15"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => removeColumn(idx)}
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
              onClick={addColumn}
              className="w-full text-center mb-6"
            >
              + Add New Column
            </Button>
          </div>

          <Button
            type="submit"
            // onClick={fetcher.submit}
            disabled={fetcher.state !== "idle"}
            variant={"primary"}
            className="w-full"
            size={"sm"}
          >
            Create Board
          </Button>
        </fetcher.Form>
      </Modal.Content>
    </Modal>
  );
};
export const DeleteBoardModal = ({ open, setOpen, board }) => {
  const fetcher = useFetcher();
  const isDone = fetcher.state === "idle" && fetcher.data != null;

  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Content>
        <Modal.Title>
          <>
            <span className="text-heading-l text-red  ">Delete Board?</span>
          </>
        </Modal.Title>
        <fetcher.Form
          method="DELETE"
          className="w-full"
          action={`/app/boards/${board?.id}`}
        >
          <p className="text-body-l text-mediumGrey my-6">
            {`Are you sure you want to delete the '${board?.title}' board? This action will remove all columns and tasks and cannot be reversed.`}{" "}
          </p>
          <div className="flex gap-4">
            <Button
              type="submit"
              // onClick={fetcher.submit}
              disabled={fetcher.state !== "idle"}
              variant={"destructive"}
              className="w-full"
              size={"sm"}
            >
              Delete
            </Button>
            <Button
              onClick={() => setOpen(false)}
              disabled={fetcher.state !== "idle"}
              variant={"secondary"}
              className="w-full"
              size={"sm"}
            >
              Cancel
            </Button>
          </div>
        </fetcher.Form>
      </Modal.Content>
    </Modal>
  );
};
export const EditBoardForm = ({ setOpen, editedBoard }) => {
  const { id } = useParams();
  const fetcher = useFetcher();
  const [columns, setColumns] = useState([...(editedBoard?.columns || [])]);
  const isDone = fetcher.state === "idle" && fetcher.data != null;
  // Function to handle subtask change
  const handleColumnChange = (index, event) => {
    const newColumns = [...columns];
    newColumns[index].title = event.target.value;
    setColumns(newColumns);
  };

  // Function to add a new subtask field
  const addColumn = (e) => {
    e.preventDefault();
    setColumns([...columns, { title: "", id: "new" }]);
  };

  // Function to remove a subtask field
  const removeColumn = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };
  useEffect(() => {
    if (isDone) setOpen(false);

    return () => {};
  }, [isDone, setOpen]);
  return (
    <fetcher.Form method="put" className="w-full" action={`/app/boards/${id}`}>
      <div className="my-6">
        <Input type="hidden" name={`totalColumns`} value={columns?.length} />
        <Input type="hidden" name={`boardId`} value={editedBoard?.id} />

        <Input
          defaultValue={editedBoard?.title}
          label={"Title"}
          type="text"
          name="title"
          id="title"
          required
        />
      </div>

      <div className="my-6">
        {columns.length ? (
          <label
            htmlFor="columns"
            className="block text-mediumGrey text-body-m mb-2"
          >
            Columns
          </label>
        ) : null}
        {columns.map((column, idx) => {
          return (
            <div
              className="flex gap-4 items-center justify-between z-0 w-full my-3"
              key={idx}
            >
              <div className="flex-grow">
                {" "}
                <Input
                  type="hidden"
                  name={`columns[${idx}][id]`}
                  value={column?.id}
                />
                <Input
                  type="text"
                  className="w-full "
                  name={`columns[${idx}][title]`}
                  id={`columns[${idx}]`}
                  required
                  value={column?.title}
                  onChange={(e) => handleColumnChange(idx, e)}
                />
              </div>
              <svg
                className="cursor-pointer  hover:fill-red fill-mediumGrey"
                width="15"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => removeColumn(idx)}
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
          onClick={addColumn}
          className="w-full text-center mb-6"
        >
          + Add New Column
        </Button>
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
