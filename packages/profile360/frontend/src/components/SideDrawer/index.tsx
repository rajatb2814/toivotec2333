import { useInitialData } from 'context/InitialDataContext';
import { useState } from 'react';
import { ReactComponent as NotesIcon } from '../../assests/images/Notes.svg';
import { ReactComponent as TodoIcon } from '../../assests/images/TodoIcon.svg';
import Notes from './Notes/index';

const SideBar = () => {
  const { initialData } = useInitialData();
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<Boolean>(false);
  const [showTodo, setShowTodo] = useState<Boolean>(false);

  return (
    // <Transition appear show={showSideBar} as={'div'}>
    //   {' '}
    //   <Transition.Child
    //     as={'div'}
    //     enter=" transition ease-in-out duration-500 transform "
    //     enterFrom="translate-x-full"
    //     enterTo="-translate-x-0"
    //     leave="transition ease-in-out duration-500 transform"
    //     leaveFrom="-translate-x-0"
    //     leaveTo="translate-x-full"
    //   >
    // <div
    //   className={`fixed right-0 h-full  `}
    // >
    <div
      className={` relative  flex h-full transform duration-500 ease-in-out   ${
        !showSideBar ? ' translate-x-full  ' : ' translate-x-0'
      }   `}
    >
      <div className=" absolute right-full mt-4 flex h-fit flex-col gap-2 pr-2 ">
        {initialData?.notes?.enabled ? (
          <div
            className="flex h-11 w-14 cursor-pointer items-center justify-center rounded bg-white shadow-secondary"
            onClick={() => {
              setShowSideBar(!showSideBar);
              setShowNotes(!showNotes);
            }}
          >
            <NotesIcon />
          </div>
        ) : null}
        {false ? (
          <div
            className="flex h-11 w-14 cursor-pointer items-center justify-center rounded bg-white shadow-secondary"
            onClick={() => {
              setShowSideBar(!showSideBar);
              setShowTodo(!showTodo);
            }}
          >
            <TodoIcon />
          </div>
        ) : null}
      </div>

      {showSideBar && showNotes ? (
        <Notes setShowSideBar={setShowSideBar} showNotes={showNotes} setShowNotes={setShowNotes} />
      ) : null}
    </div>
    // </div>
    //   </Transition.Child>
    // </Transition>
  );
};

export default SideBar;
