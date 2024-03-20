import { useState } from "react";
import {
  DotsVerticalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";

import { AddTaskModal } from "../EditTaskForm";

function Header({ cols = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-24 px-6 py-8 border-b border-b-linesLight flex justify-between items-center">
      <span className="text-heading-xl">Platform Launch</span>{" "}
      <div className="flex items-center gap-2">
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={() => setIsOpen(true)}
        >
          <span>+ Add New Task</span>
        </Button>
        {isOpen ? (
          <AddTaskModal open={isOpen} setOpen={setIsOpen} cols={cols} />
        ) : null}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="IconButton" aria-label="Customise options">
              <DotsVerticalIcon />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[100px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              sideOffset={1}
            >
              <DropdownMenu.Item
                onSelect={() => {
                  // setIsBeingEdited(true);
                }}
                className="group text-[13px] leading-none text-slate-700 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-blue-300"
              >
                <Pencil1Icon /> Edit Board
              </DropdownMenu.Item>
              <DropdownMenu.Item className="group text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500">
                <TrashIcon /> Delete Board
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default Header;
