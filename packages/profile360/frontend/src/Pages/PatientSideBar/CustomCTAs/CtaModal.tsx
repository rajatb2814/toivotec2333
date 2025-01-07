import { Dialog, Transition } from '@headlessui/react';
import React, { Dispatch, Fragment, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl } from 'utils/helpers';
import { ReactComponent as CloseBtnIcon } from '../../../assests/images/CrossBtn.svg';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalTitle: string;

  ctaId: number;
  modalMessage: string;
  sucessBtn: string;
  cancelBtn: string;
}

const CtaModal: React.FC<ModalProps> = ({
  modalTitle,
  isOpen,
  setIsOpen,
  ctaId,
  modalMessage,
  sucessBtn,
  cancelBtn,
}) => {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const { slug } = useParams();

  const ctaReq = (ctaId: number) => {
    // const { initialData } = useInitialData();
    //

    const csrftoken: string = getCookie('csrftoken');

    const FetchCall = async () => {
      let response = await fetch(getUrl(slug), {
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrftoken ? csrftoken : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_type: 'execute_cta',
          data_type: 'cta',
          data: {
            cta_id: ctaId,
          },
        }),
        credentials: 'include',
        mode: 'cors',
      });
      if (!response.ok) {
        throw Error('Error');
      }
      const data = await response.json();

      return data;
    };

    FetchCall()
      .then((result) => {
        toast.success(result.message);
        setIsOpen(false);
        setDisabledSubmit(false);
      })
      .catch((error) => {
        setDisabledSubmit(true);
        toast.error(error);
      });
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
                        ctaReq(ctaId);
                        setDisabledSubmit(true);
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

export default CtaModal;
