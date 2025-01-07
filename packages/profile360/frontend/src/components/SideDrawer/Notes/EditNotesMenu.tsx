import { Fragment } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { useState } from 'react';
import { EditNotesFormSchema } from '.';
import { ReactComponent as DotMenuBtn } from '../../../assests/images/dot-menu-btn.svg';
import EditNotesModal from './EditNotesModal';
export const EditNotesMenu = ({
  notesId,
  formSchema,
}: {
  notesId: number;
  formSchema: EditNotesFormSchema;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="">
        <Menu as="div" className="relative  text-left">
          <div>
            <Menu.Button>
              <DotMenuBtn className="h-[17px] w-[17px]" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-4 right-[-10px]   rounded bg-white p-1 shadow-primary">
              <div className="flex flex-col bg-white ">
                <Menu.Item>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="whitespace-nowrap p-[6px] text-start font-lato text-sm  tracking-[0.2px] hover:bg-secondary"
                  >
                    Edit Note
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <EditNotesModal
        formSchema={formSchema}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        modalTitle={'Edit Note'}
        notesId={notesId}
      />
    </>
  );
};
