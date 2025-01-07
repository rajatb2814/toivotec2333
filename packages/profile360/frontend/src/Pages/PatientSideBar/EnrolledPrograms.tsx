import { useInitialData } from 'context/InitialDataContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie } from 'utils/helpers';
import { getUrl } from 'utils/helpers';
import { ReactComponent as LinkIcon } from '../../assests/images/link-pop-out-icon.svg';
export type ProgramsInterface = Root[];

export interface Root {
  total_programs: TotalProgram[];
  type: string;
  label: string;
}

export interface TotalProgram {
  redirection_url: string;
  enrollment_date?: string;
  description?: string;
  program_status: string;
  program_name: string;
  id: number;
  enrolled_by?: string;
  dosage?: string;
  is_eligible?: boolean;
  apply_url?: string;
  edit_url?: string;
}

export const EnrolledPrograms = () => {
  const { initialData } = useInitialData();
  const [programsData, setProgramsData] = useState<ProgramsInterface>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const { slug } = useParams();
  useEffect(() => {
    const csrftoken: string = getCookie('csrftoken');

    fetch(getUrl(slug), {
      method: 'POST',
      headers: {
        'X-CSRFTOKEN': csrftoken ? csrftoken : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        request_type: 'data',
        data_type: 'programs_data',
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setProgramsData(result);

          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(false);
        }
      );
    // const makeApiCall = async () => {
    //   const { response, success } = await triggerApi({
    //     url: getUrl(slug, isCustomUrl),
    //     type: 'POST',
    //     payload: {
    //       request_type: 'data',
    //       data_type: 'programs_data',
    //     },
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include',
    //     loader: true,
    //   });

    //   // if (success && response) {
    //   //   setProgramsData(response);
    //   // }
    //   if (response) {
    //     setProgramsData(response);
    //   }
    // };
    // makeApiCall();
  }, []);
  //
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center ">
        <div className="inline-block transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle md:w-96">
          <div className="flex w-full flex-col items-center rounded-[6px]">
            <div className="overlay-spinner" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {initialData?.programs?.enabled &&
          programsData?.map((programs, idx) => {
            if (programs.type === 'Enrolled') {
              return (
                <div className="flex flex-col gap-[14px]  pt-4" key={idx}>
                  {programs?.total_programs?.map((enrolled_program, id) => {
                    return (
                      <a
                        rel="noreferrer"
                        href={enrolled_program?.redirection_url}
                        target={'_blank'}
                      >
                        <div
                          className="flex flex-col gap-1 px-8 py-1  transition duration-[175ms] ease-in hover:bg-secondary"
                          key={id}
                        >
                          <div className="flex justify-between">
                            <span className=" font-lato text-xs font-bold tracking-[0.2px] !text-neutral-600">
                              {enrolled_program?.program_name}
                            </span>
                            <LinkIcon />
                          </div>
                          <ProgramStatusPill status={enrolled_program?.program_status} />
                        </div>
                      </a>
                    );
                  })}
                </div>
              );
            } else {
              return null;
            }
          })}
      </div>
    );
  }
};

const ProgramStatusPill = ({ status }: { status: String }) => {
  return (
    <div
      className={` flex h-5 w-fit items-center justify-center rounded-full  px-2 font-lato text-xs font-bold tracking-wide
      ${
        status === 'Active'
          ? 'bg-pg-active-light text-pg-active-dark'
          : 'onHold' || 'DocumentShortFall'
          ? 'bg-pg-hold-light text-pg-hold-dark'
          : 'Inactive'
          ? 'bg-red-100 text-red-500'
          : ''
      }`}
    >
      {status}
    </div>
  );
};
