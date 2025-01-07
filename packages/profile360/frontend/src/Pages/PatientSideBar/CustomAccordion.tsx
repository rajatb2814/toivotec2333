import React, { useState, ReactNode } from 'react';
import { Disclosure, Transition } from '@headlessui/react';

import { ReactComponent as Plus } from '../../assests/images/icon-11.svg';
import { ReactComponent as Minus } from '../../assests/images/icon-12.svg';

interface AccordionProps {
  children?: ReactNode;
  label: string;
}

export const Accordion: React.FC<AccordionProps> = ({ label, children }): JSX.Element => {
  return (
    <>
      <Disclosure defaultOpen as="div" className="flex flex-grow flex-col">
        {({ open }) => (
          <>
            <Disclosure.Button className="mx-8 flex cursor-pointer items-center justify-between">
              <div className="semibold pr-2 font-lato text-xs leading-5 text-tertiary">{label}</div>

              {/* line */}
              <div className="h-[1px] grow bg-primary-border"></div>
              <div
                className={`h-4  w-4 transition-transform  duration-500   ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
              >
                {/* toggle buttons */}
                {!open ? <Plus /> : <Minus />}
              </div>
            </Disclosure.Button>

            <Transition
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 scale-t-95"
              enterTo="transform opacity-300 scale-t-100"
              leave="transition ease-in duration-3  00"
              leaveFrom="transform opacity-300 scale-b-100"
              leaveTo="transform opacity-0 scale-b-95"
            >
              <Disclosure.Panel className="invisible-scrollbar overflow-hidden   transition-all duration-500 ease-in-out">
                {children}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </>
  );
};
