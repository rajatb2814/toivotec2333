import { useInitialData } from 'context/InitialDataContext';
import { createContext, Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getUrl } from 'utils/helpers';
import { Accordion } from './CustomAccordion';
import CustomCTAs from './CustomCTAs';
import { getCookie } from 'utils/helpers';
import { EnrolledPrograms } from './EnrolledPrograms';
import PatientDetails from './PatientDetails';
import PatientInfo from './PatientInfo/PatientInfo';
import Tags from './Tags/Tags';

// import { UpdateProfileProvider, useRenderOnUpdate } from './PatientProfileContext';

export interface PatientInfoBarInterface {
  status: string;
  user_id: number;
  name: string;
  primary_phone: string;
  primary_phone_url: string;

  tags: TagsInterface[];
  gender: string;
  age: number;
  object_details: PatientDetail[];
  id: number;
  addresses: Address[];
  statuses: statuses[];
  status_style: string;
  form_schema: EditProifleFormSchema;
}
export type EditProifleFormSchema = EditProileSchema[];

export interface EditProileSchema {
  legend: string;
  legendData: EditProifleLegendData[];
}

export interface EditProifleLegendData {
  componentName: string;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  validationType: string;
  isNullable: boolean;
  validations: EditProfileValidation[];
  value: string;
  optionsData?: EditProfileOptionsData[];
}

export interface EditProfileValidation {
  params: string[];
  type: string;
}

export interface EditProfileOptionsData {
  label: string;
  unavailable?: boolean;
  value: any;
}

export interface PatientDetail {
  value: string;
  title: string;
  url: string;
  type: string;
}
export interface statuses {
  id: number;
  label: string;
}

export interface Address {
  is_primary: boolean;
  address: string;
  form_schema: EditAddressFormSchema;
  id: number;
  name: string;
}

export interface TagsInterface {
  note: string;
  style: string;
  id: number;
  label: string;
}
export type EditAddressFormSchema = Schema[];

export interface Schema {
  legend: any;
  legendData: EditAddressLegendData[];
}

export interface EditAddressLegendData {
  componentName: string;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  validationType: string;
  validations: EditAddressFormValidation[];
  value: any;
}

export interface EditAddressFormValidation {
  params: any[];
  type: string;
}
//@ts-ignore
export const UpdateProfileContext = createContext();

export const PatientInfobar = () => {
  const { initialData } = useInitialData();
  const [PatientDetailsData, setPatientDetailsData] = useState<PatientInfoBarInterface>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [renderOnUpdate, setRenderOnUpdate] = useState<boolean>(false);
  const { slug } = useParams();
  const toggleRenderOnUpdate = () => {
    setRenderOnUpdate((renderOnUpdate) => !renderOnUpdate);
  };

  useEffect(() => {
    setIsLoaded(false);
    const csrftoken: string = getCookie('csrftoken');

    fetch(
      getUrl(slug),

      {
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrftoken ? csrftoken : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          request_type: 'data',
          data_type: 'object_details_data',
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((result) => {
        setPatientDetailsData(result);

        setIsLoaded(true);
      })
      .catch((err) => {
        toast.error(err);
      });

    // const makeApiCall = async () => {
    //   const { response, success } = await triggerApi({
    //     url: getUrl(slug, isCustomUrl),
    //     type: 'POST',
    //     payload: {
    //       request_type: 'data',
    //       data_type: 'patient_details_data',
    //     },
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include',
    //     loader: true,
    //   });

    //   // if (success && response) {
    //   //   setProgramsData(response);
    //   // }
    //   if (response) {
    //     setPatientDetailsData(response);
    //   }
    // };
    // makeApiCall();
  }, [renderOnUpdate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="flex h-full w-[304px] items-center justify-center border-r border-primary-border">
        {' '}
        <div className="inline-block  w-full transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all  ">
          <div className="flex w-full flex-col items-center justify-center rounded-[6px] ">
            <div className="overlay-spinner" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <UpdateProfileContext.Provider value={{ toggleRenderOnUpdate }}>
        <div className="invisible-scrollbar z-10 flex w-full max-w-[304px] grow  flex-col overflow-y-scroll border-r border-primary-border">
          <div className="mb-5 flex flex-col gap-4">
            <Suspense>
              {!PatientDetailsData ? null : <PatientInfo apiData={PatientDetailsData} />}
            </Suspense>
            {<CustomCTAs />}
            <div className="flex flex-col gap-8 ">
              {initialData?.tags?.enabled && (
                <Accordion label="TAGS">
                  {!PatientDetailsData ? null : <Tags apiData={PatientDetailsData?.tags} />}
                </Accordion>
              )}
              {initialData?.programs?.enabled && initialData?.programs?.component_enabled && (
                <Accordion label="ENROLLED PROGRAM(S)">
                  <EnrolledPrograms />
                </Accordion>
              )}

              {initialData?.object_details?.enabled && (
                <Accordion label="PATIENT DETAILS">
                  {!PatientDetailsData ? null : <PatientDetails apiData={PatientDetailsData} />}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </UpdateProfileContext.Provider>
    );
  }
};
