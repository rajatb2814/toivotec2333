import { Fragment } from 'react';

import { Menu, Transition } from '@headlessui/react';
import { ReactComponent as DotMenu } from '../../../assests/images/dot-menu-btn.svg';

export const EditCardMenu = ({ editUrl }: { editUrl?: string }) => {
  return (
    <>
      <div className="">
        <Menu as="div" className="relative z-[4] text-left">
          <div>
            <Menu.Button>
              <DotMenu className="h-[17px] w-[17px]" />
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
            <Menu.Items className="absolute top-4 right-[-10px] w-24  rounded bg-white p-1 shadow-primary">
              <div className="flex flex-col bg-white ">
                <Menu.Item>
                  <button
                    onClick={() => window.location.replace(editUrl as string)}
                    className="whitespace-nowrap p-[6px] text-start font-lato text-sm  tracking-[0.2px] hover:bg-secondary"
                  >
                    Edit
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
};
