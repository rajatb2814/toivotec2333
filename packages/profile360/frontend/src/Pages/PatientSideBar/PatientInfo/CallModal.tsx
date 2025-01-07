import React, { Fragment, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ReactComponent as CloseBtnIcon } from '../../../assests/images/CrossBtn.svg';
import { placeCall } from 'utils/helpers';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalTitle: string;

  url: string | undefined;
  modalMessage: string;
  sucessBtn: string;
  cancelBtn: string;
}

const CallModal: React.FC<ModalProps> = ({
  modalTitle,
  isOpen,
  setIsOpen,
  url,
  modalMessage,
  sucessBtn,
  cancelBtn,
}) => {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModal} className="relative z-[1206]">
          <div className="fixed inset-0 bg-black bg-opacity-70" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="overflow  h-fit w-[392px] max-w-md transform overflow-auto rounded-md bg-white py-6 pl-6 transition-all">
                <Dialog.Title as="div" className=" flex items-center justify-between pr-[21px]">
                  <p className="pt-1 text-center font-lato text-xs font-bold uppercase tracking-[0.6px] text-neutral-700">
                    {modalTitle}
                  </p>
                  <button type="button" onClick={closeModal}>
                    <CloseBtnIcon className="cursor-pointer" />
                  </button>
                </Dialog.Title>

                <div className="flex flex-col items-start gap-12 pr-6 pt-4">
                  {/* <DynamicForm SubmitBtnLabel={'Submit'} /> */}
                  <div className="text-start font-lato text-sm tracking-[0.6px] text-neutral-700">
                    {modalMessage}
                  </div>
                  <div className="flex w-full">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded text-primary-action"
                    >
                      {cancelBtn}
                    </button>
                    <button
                      className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded bg-primary-action text-white disabled:cursor-default  disabled:opacity-50 "
                      onClick={() => {
                        placeCall(url, setDisabledSubmit);
                      }}
                      disabled={disabledSubmit}
                    >
                      {sucessBtn}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CallModal;
