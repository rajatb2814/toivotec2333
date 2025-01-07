import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as PinIcon } from '../../../assests/images/Pin.svg';
import { ReactComponent as NotesPlacholder } from '../../../assests/images/notepad.svg';
// import { ReactComponent as DotMenuBtn } from '../../../../assests/images/dot-menu-btn.svg';
import { ReactComponent as FileUploadIcon } from '../../../assests/images/FileUpload.svg';
import { ReactComponent as CloseBtn } from '../../../assests/images/CloseBtn.svg';
import { EditNotesMenu } from './EditNotesMenu';
import { useInitialData } from 'context/InitialDataContext';
import { AddNotesForm } from './AddNotesForm';
import { getCookie } from 'utils/helpers';

import { useParams } from 'react-router-dom';
import { getUrl } from 'utils/helpers';
export type NotesInterface = Root[];
export interface Root {
  body: string;
  title: string;
  created_at: string;
  created_by: string;
  file?: string;
  id: number;
  form_schema: EditNotesFormSchema;
}

export type EditNotesFormSchema = Schema[];
export interface Schema {
  legend: string;
  legendData: LegendData[];
}
export interface LegendData {
  componentName: string;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  validationType: string;
  isNullable: boolean;
  validations: Validation[];
  value: string;
}
export interface Validation {
  params: string[];
  type: string;
}

//@ts-ignore
export const UpdateNotesContext = createContext();
const Notes = ({
  setShowSideBar,
  showNotes,
  setShowNotes,
}: {
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  showNotes: Boolean;
  setShowNotes: Dispatch<SetStateAction<Boolean>>;
}) => {
  const { initialData } = useInitialData();
  const [notesData, setNotesData] = useState<NotesInterface>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [renderOnUpdate, setRenderOnUpdate] = useState<boolean>(false);

  const [error, setError] = useState<Error>();
  const { slug } = useParams();
  const toggleRenderOnUpdate = () => {
    setRenderOnUpdate((renderOnUpdate) => !renderOnUpdate);
  };
  useEffect(() => {
    setIsLoaded(false);
    // const makeApiCall = async () => {
    //   const { response, success } = await triggerApi({
    //     url: getUrl(slug, isCustomUrl),
    //     type: 'POST',
    //     payload: {
    //       request_type: 'data',
    //       data_type: 'notes_data',
    //     },
    //     loader: true,
    //   });

    //   if (response) {
    //     setNotesData(response);
    //   }
    // };
    const FetchNotesData = () => {
      const csrftoken: string = getCookie('csrftoken');

      fetch(getUrl(slug), {
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrftoken ? csrftoken : '',
          'Content-Type': 'application/json',
        },
        // headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
        body: JSON.stringify({
          request_type: 'data',
          data_type: 'notes_data',
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            setNotesData(result);

            setIsLoaded(true);
          },
          (error) => {
            setIsLoaded(false);
          }
        );
    };
    FetchNotesData();
    // makeApiCall();
  }, [renderOnUpdate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div
        className={`   ${
          !showNotes ? 'hidden ' : ''
        } flex h-full w-[351px] items-center justify-center  bg-ghost-white `}
      >
        <div className="inline-block transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle md:w-96">
          <div className="flex w-full flex-col items-center rounded-[6px]">
            <div className="overlay-spinner" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <UpdateNotesContext.Provider value={{ toggleRenderOnUpdate }}>
        <div
          className={`transform-all flex h-full w-[351px] flex-col bg-ghost-white duration-500 ease-in-out ${
            showNotes ? 'translate-x-0' : 'translate-x-full'
          }   `}
        >
          <header className={`flex items-center justify-between px-5 pt-4 `}>
            <div className="flex items-center gap-3">
              <PinIcon />
              <span className="font-sans-pro text-lg font-semibold tracking-[0.2px]">Notes</span>
            </div>
            <CloseBtn
              className="cursor-pointer"
              onClick={() => {
                setShowSideBar(false);
                setShowNotes(false);
              }}
            />
          </header>

          {/* form Start */}

          <div className={`px-4 py-4`}>
            <AddNotesForm />
          </div>

          {/* form end */}

          <section className={`invisible-scrollbar h-full overflow-auto  `}>
            <div
              className={`flex flex-col gap-4 px-4 pb-4  ${
                notesData?.length !== 0 ? 'justify-start' : 'h-full items-center justify-center'
              }`}
            >
              {notesData?.length !== 0 ? (
                initialData?.notes?.enabled &&
                notesData?.map((notes, key) => {
                  const footer = () => {
                    return (
                      'by ' +
                      notes?.created_by +
                      ', ' +
                      notes?.created_at?.slice(0, 12) +
                      ', ' +
                      notes?.created_at?.slice(12)
                    );
                  };
                  return (
                    <div
                      className="flex flex-col gap-4 rounded border border-primary-border px-4 pt-3 pb-4"
                      key={key}
                    >
                      <div className="flex items-center justify-between ">
                        <span className="font-lato text-xs font-normal tracking-[0.2px] text-tertiary">
                          {footer()}
                        </span>
                        {/* {true ? ( */}
                        {initialData?.notes?.allow_edit ? (
                          <span>
                            <EditNotesMenu
                              formSchema={notes.form_schema}
                              notesId={notes.id}
                            ></EditNotesMenu>
                          </span>
                        ) : null}
                      </div>
                      <div className="pr-4">
                        <div className="flex flex-col gap-2 font-lato text-sm font-normal tracking-[0.2px] text-neutral-700">
                          {notes.body}

                          {/* display Files Start */}
                          {notes.file !== null ? (
                            <div className="flex flex-col ">
                              <div className="flex items-center" key={key}>
                                <FileUploadIcon className="text-[#6D6D6D]" />
                                <a
                                  href={notes.file}
                                  target={'blank'}
                                  className="cursor-pointer pl-2 font-lato text-sm tracking-[0.2px] !text-primary-action"
                                >
                                  Document
                                </a>
                              </div>
                              {/* ))} */}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {/* display Files Start */}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <NotesPlacholder></NotesPlacholder>
                  <span className="font-lato text-xs font-bold tracking-[0.2px]">
                    Start taking notes, reminders, add tasks
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </UpdateNotesContext.Provider>
    );
  }
};

export default Notes;
