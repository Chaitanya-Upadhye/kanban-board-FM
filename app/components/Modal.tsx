import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { cn } from "~/utils";

function Modal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}
function ModalContent({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="bg-white fixed top-[300px] left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-contentShow max-h-[60%] rounded-md md:w-[480px] w-[90%]  overflow-y-auto  p-8">
        {/* <Dialog.Title className="text-heading-l">{title}</Dialog.Title> */}

        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
Modal.Button = Dialog.Trigger;
Modal.Header = Dialog.Title;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
// eslint-disable-next-line react/display-name
Modal.Title = ({ children, title = "", ...rest }) => {
  if (children) {
    return <Dialog.Title asChild>{children}</Dialog.Title>;
  }

  return <Dialog.Title {...rest}>{title}</Dialog.Title>;
};
// eslint-disable-next-line react/display-name
Modal.Overlay = ({ className = "" }) => {
  return (
    <Dialog.Overlay
      className={cn(
        "bg-black/50 data-[state=open]:animate-overlayShow fixed inset-[100px]",
        className
      )}
    ></Dialog.Overlay>
  );
};

export default Modal;
