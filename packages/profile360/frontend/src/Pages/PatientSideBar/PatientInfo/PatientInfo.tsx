import { useInitialData } from 'context/InitialDataContext';
import { useState } from 'react';
import { PatientInfoBarInterface } from '..';
import { ReactComponent as BackArrow } from '../../../assests/images/back-arrow-icon.svg';
import { ReactComponent as PhoneIcon } from '../../../assests/images/Phone.svg';
import EditProfile from '../EditProfile/EditProfile';
import CallModal from './CallModal';

const PatientInfo = ({ apiData }: { apiData: PatientInfoBarInterface | undefined }) => {
  const { initialData } = useInitialData();
  const [openCallModal, setOpenCallModal] = useState<boolean>(false);
  const genders: Record<string, string> = {
    m: 'Male',
    f: 'Female',
    o: 'Other',
    d: 'Prefer not to say',
  };
  const gender = apiData && apiData.gender in genders ? apiData.gender : 'Error';

  //checks patient status
  const statusStyles: { [key: string]: string | undefined } = {
    Yellow: 'bg-pg-hold-medium border-[#FEC76A] ',
    Green: 'border-[#A1E9D3] bg-pg-active-medium  ',
    Red: 'bg-[#ff6161] border-[#FEC76A]',
  };

  const FormatNum = (num: string | undefined): string | undefined => {
    return num && num?.toString()?.slice(0, 5) + num?.slice(5).replace(/.(?=...)/g, '*');
  };

  return (
    <div className="flex flex-col gap-[26px] pt-[18px] pl-[25px] ">
      {/* <div
        className="flex w-fit cursor-pointer items-center gap-2"
        onClick={() => {
          window.history.back();
        }}
      >
        <BackArrow />
        <div className="font-lato text-xs font-bold uppercase leading-5 tracking-[0.6px]">
          {' '}
          Back
        </div>
      </div> */}
      <div className=" flex flex-col gap-1 pl-[7px] pr-5 ">
        <div className="flex items-start justify-between ">
          {initialData?.object_details?.profile?.name_enabled && (
            <p className="max-w-[90%] break-words font-sans-pro text-[22px] font-semibold leading-7 tracking-[-0.2px]">
              {apiData?.name}
            </p>
          )}

          {initialData?.object_details?.allow_edit &&
          (initialData?.object_status?.allow_edit || apiData?.statuses.length !== 0) ? (
            <span className="relative pt-1">
              <EditProfile apiData={apiData} />
            </span>
          ) : null}
        </div>
        {initialData?.object_details?.profile?.status_enabled && (
          <>
            <div
              className={`flex w-fit items-center justify-center rounded-full py-[5px] px-2 text-center font-lato text-[11px]  font-bold leading-4 tracking-[0.4px] text-white  ${
                statusStyles[apiData ? apiData.status_style : 'Error']
              }  `}
            >
              {apiData?.status?.toUpperCase()}
            </div>
          </>
        )}

        <span className="flex gap-1 font-lato text-sm font-bold text-neutral-600">
          {initialData?.object_details?.profile?.gender_enabled && <p>{genders[gender]} </p>}
          {initialData?.object_details?.profile?.gender_enabled &&
            initialData?.object_details?.profile?.age_enabled && <>-</>}

          {initialData?.object_details?.profile?.age_enabled && (
            <p>{apiData?.age?.toString() + ' years'}</p>
          )}
        </span>

        {apiData?.user_id && initialData?.object_details?.profile?.user_id_enabled && (
          <span className="flex gap-1 ">
            <span className="font-lato text-xs font-normal text-tertiary">Member ID:</span>
            <span className=" font-lato text-xs font-bold tracking-[0.2px] text-neutral-600">
              {apiData?.user_id}
            </span>
          </span>
        )}
        {initialData?.object_details?.profile?.phone_enabled && (
          <span className="flex items-center  gap-2">
            <button
              className="cursor-pointer disabled:cursor-default disabled:opacity-50"
              disabled={!initialData?.integrations?.telephony.enabled}
              onClick={() => {
                setOpenCallModal(true);
              }}
            >
              <PhoneIcon />
            </button>
            <p className=" font-lato text-sm  font-bold tracking-[0.2px]">
              {apiData?.primary_phone}
            </p>
          </span>
        )}
      </div>
      <CallModal
        isOpen={openCallModal}
        setIsOpen={setOpenCallModal}
        modalTitle={`Call ${apiData?.primary_phone}`}
        modalMessage={'Are you sure you want to make this call?'}
        sucessBtn={'Yes'}
        cancelBtn={'No'}
        url={apiData?.primary_phone_url}
      />
    </div>
  );
};
export default PatientInfo;
