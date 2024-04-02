import { useState, useEffect } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "../Button";

import { AddTaskModal } from "../EditTaskForm";
import {
  DeleteBoardModal,
  EditBoardModal,
  AddBoardModal,
} from "../EditBoardForm";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { IconDark, IconLight, useTheme } from "./Sidebar";
import * as Switch from "@radix-ui/react-switch";

function Header({ cols = [], title = "", board }) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const {
    isActive,
    setIsActive,
    userBoards: boards,
    supabase,
  } = useOutletContext();
  const navigate = useNavigate();
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    width <= 576 && setIsActive(false);
    return () => {};
  }, [width]);

  if (width <= 576) {
    return (
      <div
        className={`bg-white h-16 px-4 py-5  border-b border-b-linesLight flex justify-between items-center
        `}
      >
        <div className=" transition-all flex">
          <div className="pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25">
              <g fill="#635FC7" fill-rule="evenodd">
                <rect width="6" height="25" rx="2" />
                <rect opacity=".75" x="9" width="6" height="25" rx="2" />
                <rect opacity=".5" x="18" width="6" height="25" rx="2" />
              </g>
            </svg>
          </div>{" "}
          <Dialog.Root open={isBoardMenuOpen} onOpenChange={setIsBoardMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                className="cursor:pointer  mr-2 flex"
                aria-label="Customise options"
              >
                <span className="ml-4  block text-heading-xl text-black mr-2">
                  {title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="7"
                  className="mt-3"
                >
                  <path
                    stroke="#635FC7"
                    stroke-width="2"
                    fill="none"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                id="modal-overlay"
                className="bg-black/50 data-[state=open]:animate-overlayShow fixed right-0 left-0 bottom-0 top-[64px]"
              />

              <Dialog.Content className=" rounded-md data-[state=open]:animate-contentShow fixed top-[240px] left-[50%] max-h-[85vh] w-[264px] max-w-[450px] translate-x-[-50%] translate-y-[-50%]  bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <div className="flex flex-col justify-between h-full">
                  <ul className="flex-1 font-medium flex flex-col mt-4 mr-6 ">
                    <li className="text-heading-s pl-8 mb-4 text-mediumGrey">{`ALL BOARDS (${boards?.length})`}</li>
                    {boards.map((b: any) => {
                      const { id: boardId, title } = b;
                      return (
                        <li
                          data-active={boardId == board.id}
                          key={boardId}
                          className={` hover:bg-slate-50   flex gap-4 items-end cursor-pointer pl-8   text-heading-m  ${
                            boardId == board?.id
                              ? "bg-mainPurple rounded-r-3xl text-white py-4"
                              : "text-mediumGrey hover:bg-mainPurple/10 hover:text-mainPurple py-4 rounded-r-3xl"
                          } `}
                          onClick={() => {
                            navigate(`/app/boards/${boardId}`);
                            setIsBoardMenuOpen(false);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                              fill={boardId == board?.id ? "white" : "#828FA3"}
                            />
                          </svg>
                          <span className="text-slate-500 hover:text-blue-600 text-md ">
                            {title}
                          </span>
                        </li>
                      );
                    })}
                    <li
                      id={"create-board"}
                      className={` hover:bg-slate-50   flex gap-4 items-center cursor-pointer pl-8 py-4   text-heading-m  `}
                      onClick={() => {
                        setShowAddBoardModal(true);
                        setIsBoardMenuOpen(false);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                          fill={"hsl(242, 48%, 58%"}
                        />
                      </svg>
                      <span className="text-mainPurple text-heading-m ">
                        {"+ Create Board"}
                      </span>
                    </li>
                  </ul>
                  <div className=" flex justify-center gap-4 items-center py-6 bg-lightGreyLightBg mx-8 rounded-md h-[48px] mt-4 mb-6">
                    <div>
                      <IconLight />
                    </div>
                    <Switch.Root
                      onCheckedChange={toggleTheme}
                      checked={theme === "dark"}
                      className="w-[40px] h-[20px] bg-mainPurple rounded-full relative  data-[state=checked]:bg-mainPurple outline-none cursor-pointer"
                      id="airplane-mode"
                      style={{
                        "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
                      }}
                    >
                      <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[24px]" />
                    </Switch.Root>
                    <div>
                      <IconDark />
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={"primary"}
            size={"lg"}
            onClick={() => setIsOpen(true)}
            className={`${
              cols?.length ? "" : "opacity-50 cursor-not-allowed "
            }`}
            disabled={!cols?.length}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
              <path
                fill="#FFF"
                d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
              />
            </svg>{" "}
          </Button>
          {isOpen ? (
            <AddTaskModal open={isOpen} setOpen={setIsOpen} cols={cols} />
          ) : null}
          {showEditBoardModal ? (
            <EditBoardModal
              open={showEditBoardModal}
              setOpen={setShowEditBoardModal}
              editedBoard={board}
            />
          ) : null}
          {showDeleteBoardModal ? (
            <DeleteBoardModal
              open={showDeleteBoardModal}
              setOpen={setShowDeleteBoardModal}
              board={board}
            />
          ) : null}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor:pointer" aria-label="Customise options">
                <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
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
                    setShowEditBoardModal(true);
                  }}
                  className="mb-4 group cursor-pointer text-body-l text-mediumGrey leading-none text-slate-700 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-blue-300"
                >
                  Edit Board
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => {
                    setShowDeleteBoardModal(true);
                  }}
                  className="mb-4 cursor-pointer group text-body-l text-red text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
                >
                  Delete Board
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={async () => {
                    await supabase.auth.signOut();
                    navigate("/login");
                  }}
                  className="cursor-pointer group text-body-l text-redHover text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        {showAddBoardModal ? (
          <AddBoardModal
            open={showAddBoardModal}
            setOpen={setShowAddBoardModal}
          />
        ) : null}
      </div>
    );
  }
  return (
    <div
      className={`bg-white h-24 px-6  border-b border-b-linesLight flex justify-between items-center`}
    >
      {!isActive ? (
        <div className=" transition-all flex    h-[96px]">
          <div className="w-[210px] py-8">
            <svg width="153" height="26" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path
                  id="logo-mark"
                  d="M44.56 25v-5.344l1.92-2.112L50.928 25h5.44l-6.304-10.432 6.336-7.04h-5.92l-5.92 6.304V.776h-4.8V25h4.8Zm19.36.384c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM81.968 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Zm24.16.384c1.707 0 3.232-.405 4.576-1.216a8.828 8.828 0 0 0 3.184-3.296c.779-1.387 1.168-2.923 1.168-4.608 0-1.707-.395-3.248-1.184-4.624a8.988 8.988 0 0 0-3.2-3.28c-1.344-.81-2.848-1.216-4.512-1.216-2.112 0-3.787.619-5.024 1.856V.776h-4.8V25h4.48v-1.664c.619.661 1.392 1.168 2.32 1.52a8.366 8.366 0 0 0 2.992.528Zm-.576-4.32c-1.301 0-2.363-.443-3.184-1.328-.821-.885-1.232-2.043-1.232-3.472 0-1.408.41-2.56 1.232-3.456.821-.896 1.883-1.344 3.184-1.344 1.323 0 2.41.453 3.264 1.36.853.907 1.28 2.053 1.28 3.44 0 1.408-.427 2.56-1.28 3.456-.853.896-1.941 1.344-3.264 1.344Zm17.728 4.32c2.176 0 3.925-.672 5.248-2.016V25h4.48V13.48c0-1.259-.315-2.363-.944-3.312-.63-.95-1.51-1.69-2.64-2.224-1.13-.533-2.432-.8-3.904-.8-1.856 0-3.483.427-4.88 1.28-1.397.853-2.352 2.005-2.864 3.456l3.84 1.824a4.043 4.043 0 0 1 1.424-1.856c.65-.47 1.403-.704 2.256-.704.896 0 1.605.224 2.128.672.523.448.784 1.003.784 1.664v.48l-4.832.768c-2.09.341-3.648.992-4.672 1.952-1.024.96-1.536 2.176-1.536 3.648 0 1.579.55 2.816 1.648 3.712 1.099.896 2.587 1.344 4.464 1.344Zm.96-3.52c-.597 0-1.099-.15-1.504-.448-.405-.299-.608-.715-.608-1.248 0-.576.181-1.019.544-1.328.363-.31.885-.528 1.568-.656l3.968-.704v.544c0 1.067-.363 1.973-1.088 2.72-.725.747-1.685 1.12-2.88 1.12ZM141.328 25V14.792c0-1.003.299-1.808.896-2.416.597-.608 1.365-.912 2.304-.912.939 0 1.707.304 2.304.912.597.608.896 1.413.896 2.416V25h4.8V13.768c0-1.323-.277-2.48-.832-3.472a5.918 5.918 0 0 0-2.32-2.32c-.992-.555-2.15-.832-3.472-.832-1.11 0-2.09.208-2.944.624a4.27 4.27 0 0 0-1.952 1.904V7.528h-4.48V25h4.8Z"
                  fill="#000112"
                  fill-rule="nonzero"
                />
                <g transform="translate(0 1)" fill="#635FC7">
                  <rect width="6" height="25" rx="2" />
                  <rect opacity=".75" x="9" width="6" height="25" rx="2" />
                  <rect opacity=".5" x="18" width="6" height="25" rx="2" />
                </g>
              </g>
            </svg>
          </div>
          <div className="h-full w-[1px] bg-linesLight "></div>
          <span className="ml-8 py-8 block text-heading-xl text-black">
            {title}
          </span>{" "}
        </div>
      ) : null}
      {isActive ? (
        <span className="text-heading-xl text-black">{title}</span>
      ) : null}{" "}
      <div className="flex items-center gap-2">
        <Button
          variant={"primary"}
          size={"lg"}
          onClick={() => setIsOpen(true)}
          className={`${cols?.length ? "" : "opacity-50 cursor-not-allowed"}`}
          disabled={!cols?.length}
        >
          <span className="text-heading-m text-[#fff]">+ Add New Task</span>
        </Button>
        {isOpen ? (
          <AddTaskModal open={isOpen} setOpen={setIsOpen} cols={cols} />
        ) : null}
        {showEditBoardModal ? (
          <EditBoardModal
            open={showEditBoardModal}
            setOpen={setShowEditBoardModal}
            editedBoard={board}
          />
        ) : null}
        {showDeleteBoardModal ? (
          <DeleteBoardModal
            open={showDeleteBoardModal}
            setOpen={setShowDeleteBoardModal}
            board={board}
          />
        ) : null}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="cursor:pointer" aria-label="Customise options">
              <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
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
                  setShowEditBoardModal(true);
                }}
                className="mb-4 group cursor-pointer text-body-l text-mediumGrey leading-none text-slate-700 rounded-[3px] flex gap-2 items-center h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-blue-300"
              >
                Edit Board
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => {
                  setShowDeleteBoardModal(true);
                }}
                className="mb-4 cursor-pointer group text-body-l text-red text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
              >
                Delete Board
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={async () => {
                  await supabase.auth.signOut();
                  navigate("/login");
                }}
                className="cursor-pointer group text-body-l text-redHover text-[13px] leading-none text-red-700 rounded-[3px] flex gap-2 items-center  h-[25px] px-[5px] relative  select-none outline-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500"
              >
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
export default Header;
// write a useWindowSize hook to get the window size and use it in the Header component
