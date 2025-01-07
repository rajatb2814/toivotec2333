// import { Fragment, useRef, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useInitialData } from 'context/InitialDataContext';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { PatientInfoBarInterface } from '..';
import { ReactComponent as DotMenuBtn } from '../../../assests/images/dot-menu-btn.svg';
import Toggle from '../Toggle';
import EditProfileModal from './EditProfileModal';
import EditStatusModal from './EditStatusModal';

// import { Popover } from '@headlessui/react';
const EditProfile = ({ apiData }: { apiData: PatientInfoBarInterface | undefined }) => {
  const { initialData } = useInitialData();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [statusId, setStatusId] = useState<number>(0);

  // const [customOpen, setCustomOpen] = useState(false);

  // function buttonClicked() {
  //   setCustomOpen((prev) => !prev);
  // }

  // const ref = useRef(null);
  // useClickAway(ref, () => {
  //   //
  //   // setCustomOpen(false);
  // });

  return (
    <>
      <div className="">
        <Menu as="div" className="ttext-left relative inline-block flex">
          {({ open }) => {
            return (
              <>
                <Menu.Button>
                  <DotMenuBtn />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/* <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"> */}
                  <Menu.Items
                    className="absolute top-4 right-[-10px]  z-10 w-[190px] rounded bg-white p-1 shadow-primary"
                    static
                  >
                    <div className="flex flex-col bg-white ">
                      {initialData?.object_status?.allow_edit
                        ? apiData?.statuses.map((configStatus, key) => (
                            <div key={key}>
                              <MarkStatus
                                label={configStatus.label}
                                status={apiData?.status}
                                statusId={configStatus.id}
                                setIsModalOpen={setIsStatusModalOpen}
                                setStatusId={setStatusId}
                              />
                            </div>
                          ))
                        : null}
                      {initialData?.object_details?.allow_edit ? (
                        <Menu.Item>
                          <div className="w-full">
                            <button
                              onClick={() => setIsEditModalOpen(true)}
                              className=" flex w-full items-center py-[6px] px-3  text-start font-lato text-sm font-semibold tracking-[0.2px] hover:bg-secondary"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </Menu.Item>
                      ) : null}
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            );
          }}
        </Menu>
      </div>
      <EditProfileModal
        formSchema={apiData?.form_schema}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        modalTitle={'Edit Profile'}
      />
      <EditStatusModal
        modalTitle="Edit Status"
        statusId={statusId}
        isOpen={isStatusModalOpen}
        setIsOpen={setIsStatusModalOpen}
        // isTagToggle={isTagToggle}
        // setIsTagToggle={setIsTagToggle}
      />
    </>
  );
};
const MarkStatus = ({
  label,
  status,
  statusId,
  setIsModalOpen,
  setStatusId,
}: {
  label: string;
  status: string | undefined;
  statusId: number;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setStatusId: Dispatch<SetStateAction<number>>;
}) => {
  const [isTagToggle, setIsTagToggle] = useState<boolean>(false);
  // const { initialData } = useInitialData()

  return (
    <div className="py-3 px-3">
      <Menu.Item>
        <div className=" flex h-full flex-col  ">
          <Toggle
            isTagToggle={isTagToggle}
            setIsTagToggle={setIsTagToggle}
            isTag={false}
            setOpenModal={setIsModalOpen}
            label={`Mark ${label}`}
            labelStyle="font-lato text-sm font-bold tracking-[0.2px]"
            defaultState={status === label}
            statusId={statusId}
            setStatusId={setStatusId}
          />
          <span className=" font-lato text-xs font-normal tracking-[0.2px] text-neutral-400">
            Currently {status}
          </span>
        </div>
      </Menu.Item>
    </div>
  );
};

export default EditProfile;
