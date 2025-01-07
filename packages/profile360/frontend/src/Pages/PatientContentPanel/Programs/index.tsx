import { useInitialData } from 'context/InitialDataContext';
import { ProgramsInterface } from 'Pages/PatientSideBar/EnrolledPrograms';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUrl } from 'utils/helpers';
import { getCookie } from 'utils/helpers';
import GenerateOrderModal from './GenerateOrderModal';
import ProgramsGroup from './ProgramsGroup';
const Index = () => {
  const { slug } = useParams();
  const { initialData } = useInitialData();
  const [showGenerateOrder, setShowGenerateOrder] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [error, setError] = useState<Error>();
  const [programsData, setProgramsData] = useState<ProgramsInterface>();
  let response: Response;
  const FetchPrograms = async () => {
    const csrftoken: string = getCookie('csrftoken');

    response = await fetch(getUrl(slug), {
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
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    return result;
  };
  useEffect(() => {
    // fetch(
    //   getUrl(slug),

    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include',
    //     body: JSON.stringify({
    //       request_type: 'data',
    //       data_type: 'programs_data',
    //     }),
    //   }
    // )
    //   .then((res) => res.json())
    FetchPrograms().then(
      (result) => {
        setProgramsData(result);

        setIsLoaded(true);
      },
      (error) => {
        setError(error);
        setIsLoaded(true);
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

  if (error) {
    return <div> {error.message}</div>;
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
      <>
        <div className="flex flex-grow flex-col">
          {/* <div className="flex gap-1 pt-6 pl-6">
          {initialData?.programs?.components &&
            initialData?.programs?.components.map((filters, key) => {
              return (
                <React.Fragment key={key}>
                  <Filters
                    filters={filters}
                    setfiltersArr={setFiltersArr}
                    filtersArr={filtersArr}
                    defaultCheck={filters === 'All Programs'}
                  />
                </React.Fragment>
              );
            })}
        </div> */}

          <div className=" invisible-scrollbar relative h-[10px] flex-grow overflow-auto ">
            {/* <div className="absolute right-[88px] top-6 z-10">
            <GenerateOrderBtn setShowModal={setShowGenerateOrder} showModal={showGenerateOrder} />
          </div> */}
            {initialData?.programs?.enabled &&
              programsData?.map((prg_data, key) => {
                // if (
                //   filtersArr.includes(prg_data.type + ' Programs') ||
                //   filtersArr.includes('All Programs')
                // ) {
                return (
                  <React.Fragment key={key}>
                    <ProgramsGroup
                      key={key}
                      label={prg_data.label}
                      count={prg_data.total_programs?.length}
                      prgData={programsData}
                      type={prg_data.type}
                    />
                  </React.Fragment>
                );
                // } else {
                //   return null;
                // }
              })}
          </div>
        </div>
        {showGenerateOrder ? (
          <GenerateOrderModal isOpen={showGenerateOrder} setIsOpen={setShowGenerateOrder} />
        ) : null}
      </>
    );
  }
};

export default Index;
