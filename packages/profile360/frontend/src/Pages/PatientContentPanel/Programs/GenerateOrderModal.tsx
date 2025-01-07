import * as React from 'react';
import { useState } from 'react';
import { Fragment } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ReactComponent as CloseBtnIcon } from '../../../assests/images/CrossBtn.svg';
import { ReactComponent as CalendarIcon } from '../../../assests/images/CalendarIcon.svg';
import { ReactComponent as UploadFileIcon } from '../../../assests/images/UploadFileIcon.svg';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const GenerateOrderModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModal} className="relative z-[1206]">
          <div className="fixed inset-0 bg-black bg-opacity-70" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-end pr-0 text-center">
              <Dialog.Panel className="relative min-h-screen w-[498px]  transform bg-white transition-all">
                <Dialog.Title
                  as="div"
                  className="flex flex-col items-center  pl-8 pr-[17px] pt-[17px]"
                >
                  <div className=" flex w-full justify-end">
                    <CloseBtnIcon
                      className="h-[18px] w-[18px] cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>
                  <div className="flex w-full justify-start">
                    <p className="  text-center font-sans-pro text-[22px] font-semibold leading-7  text-black">
                      Generate Paid Orders
                    </p>
                  </div>
                </Dialog.Title>
                <div className="flex flex-col gap-4 px-8 pt-12">
                  <NumInputField label={'Invoice Number'} placeholder={'00000'} />
                  <DateInputField label={'Invoice Date'} placeholder={'Select'} />
                  <FileUploadField label={'Upload ID Proof'} placeholder={'Click to Upload'} />
                </div>

                <div className="absolute bottom-0 w-full px-8 pb-8">
                  <button
                    className="text center w-full rounded bg-primary-action  py-[11px] text-white disabled:cursor-default disabled:opacity-30"
                    disabled={false}
                  >
                    Generate Order
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const InputLabels = ({ label }: { label: String }) => {
  return (
    <label className=" font-lato text-xs font-semibold tracking-[0.4px] text-neutral-400 ">
      {label}
    </label>
  );
};

const NumInputField = ({ label, placeholder }: { label: string; placeholder: string }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <InputLabels label={label} />
      <input
        type="number"
        id="numInput"
        className=" h-12 w-[370px] rounded-md border border-primary-border px-4 py-4 focus-visible:outline-none "
        placeholder={placeholder}
      ></input>
    </div>
  );
};

const DateInputField = ({ label, placeholder }: { label: string; placeholder: string }) => {
  const [date, setDate] = useState<string>('');
  return (
    <div className="relative flex flex-col items-start gap-1">
      <InputLabels label={label} />
      <input
        type="date"
        id="dateInput"
        placeholder={placeholder}
        className="absolute top-4 left-[-4px] h-0 w-0 focus-visible:outline-none"
        onChange={(e) => setDate(e.target.value)}
      ></input>
      <label
        htmlFor={'dateInput'}
        className=" flex h-12 w-[370px] cursor-pointer items-center justify-between rounded-md border border-primary-border px-4  focus-visible:outline-none"
      >
        <p className="font-lato text-sm text-neutral-400">{date ? date : placeholder}</p>
        <CalendarIcon />
      </label>
    </div>
  );
};

const FileUploadField = ({ label, placeholder }: { label: string; placeholder: string }) => {
  const [fileName, setFileName] = useState<string | undefined>('');
  return (
    <div className="relative flex flex-col items-start gap-1">
      <InputLabels label={label} />
      <input
        type="file"
        id="Upload-ID"
        className="absolute h-0 w-0 focus-visible:outline-none"
        onChange={(e) => setFileName(e.target.files?.item(0)?.name)}
      ></input>
      <label
        htmlFor="Upload-ID"
        className="flex h-12 w-[370px] cursor-pointer items-center justify-between rounded-md border border-dashed border-primary-border px-4"
      >
        <p className={`font-lato text-sm ${fileName ? 'text-black' : 'text-neutral-400'}`}>
          {fileName ? fileName : placeholder}
        </p>
        <UploadFileIcon />
      </label>
    </div>
  );
};

export default GenerateOrderModal;
