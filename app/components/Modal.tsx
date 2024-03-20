import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

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
      <Dialog.Content className="bg-white fixed top-[300px] left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-contentShow transition-height duration-1000 rounded-md w-[480px]   overflow-y-auto  p-8">
        <Dialog.Title title="Add" className="text-heading-l">
          {title}
        </Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
Modal.Button = Dialog.Trigger;
Modal.Header = Dialog.Title;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;

export default Modal;
