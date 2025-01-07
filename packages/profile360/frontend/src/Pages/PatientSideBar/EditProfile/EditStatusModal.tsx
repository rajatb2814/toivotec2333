import React, { Fragment } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { ReactComponent as CloseBtnIcon } from '../../../assests/images/modal-close-button.svg';
import EditStatusDynamicForm from './EditStatusDynamicForm';
interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  // setIsTagToggle: Dispatch<SetStateAction<boolean>>;
  // isTagToggle: boolean;
  modalTitle: string;
  statusId: number;
}

const EditStatusModal: React.FC<ModalProps> = ({
  modalTitle,
  isOpen,
  setIsOpen,
  // setIsTagToggle,
  // isTagToggle,
  statusId,
}) => {
  const closeModal = () => {
    setIsOpen(false);
    // setIsTagToggle(!isTagToggle);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModal} className="relative z-[1206]">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-out duration-400"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-end text-center">
              <Transition.Child
                as={Fragment}
                enter=" transition ease-in-out duration-500 transform "
                enterFrom="translate-x-full"
                enterTo="-translate-x-0"
                leave="transition ease-in-out duration-500 transform"
                leaveFrom="-translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="overflow invisible-scrollbar fixed flex h-full min-w-[498px] max-w-md grow transform flex-col overflow-auto  bg-white transition-all">
                  <Dialog.Title
                    as="div"
                    className=" relative flex items-center justify-between p-8"
                  >
                    <p className="pt-1 text-center font-sans-pro text-[22px]  font-semibold tracking-[0.6px] ">
                      {modalTitle}
                    </p>
                    <button className="absolute  top-6 right-6" type="button" onClick={closeModal}>
                      <CloseBtnIcon className="cursor-pointer" />
                    </button>
                  </Dialog.Title>

                  <div className="flex  grow flex-col items-start gap-2  ">
                    <EditStatusDynamicForm
                      SubmitBtnLabel={'Submit'}
                      statusId={statusId}
                      // toggled_state={isTagToggle ? 'on' : 'off'}
                      setIsOpen={setIsOpen}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditStatusModal;
