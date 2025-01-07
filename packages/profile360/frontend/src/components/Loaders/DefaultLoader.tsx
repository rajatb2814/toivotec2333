import { Dialog, Transition } from '@headlessui/react';
import { createContext, Fragment, useEffect, useMemo, useState, useRef, useContext } from 'react';

import { ReactComponent as CancelButtonIcon } from '../../assets/images/cancel-message.svg';
import { ReactComponent as IconModalClose } from '../../assets/images/modal-close.svg';

// export default function DefaultLoader({ isComponentLoaded }: { isComponentLoaded: boolean }) {
export default function DefaultLoader({ showSpinner }: { showSpinner: boolean }) {
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(isLoading);
    }
  }, [isLoading]);

  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  return (
    <Transition.Root show={!isVisible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setVisible}
        initialFocus={modalContentRef}
      >
        <div
          ref={modalContentRef}
          className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-100"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-100"
          >
            <Dialog.Overlay
              className="fixed inset-0 backdrop-blur-sm transition-opacity"
              onClick={handleOverlayClick}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          {showSpinner && (
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle md:w-96">
                <div className="flex w-full flex-col items-center rounded-[6px]">
                  <div className="overlay-spinner" />
                </div>
              </div>
            </Transition.Child>
          )}
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// export function useLoader() {
//   return useContext(LoaderContext);
// }
