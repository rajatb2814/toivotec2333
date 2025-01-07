import React from 'react';
import moment from 'moment';
import { useState } from 'react';
import { useInitialData } from 'context/InitialDataContext';
import { EditCardMenu } from '../EditCardMenu';

interface EnrolledCardProps {
  name?: string;
  description?: string;
  status: string;
  date_enrolled?: string;
  enrolled_by?: string;
  dosage?: string;
  programId?: number | string;
  url?: string;
  editUrl?: string;
}

const EnrolledCard: React.FC<EnrolledCardProps> = ({
  name,
  description,
  status,
  date_enrolled,
  enrolled_by,
  dosage,
  programId,
  url,
  editUrl,
}): JSX.Element => {
  const [showDetailsBtn, setShowDetailsBtn] = useState<Boolean>(false);
  const statusStyles: { [key: string]: string } = {
    'On-Hold': '!bg-[#FFEFD4] !text-[#694200] !border-[#FEC76A] ',
    Active: '!border-[#A1E9D3] !bg-pg-active-light !text-[#0F3F30]',
    Suspended: '!bg-[#FBE0DD] !text-[#55100A] !border-[#F3A29A]',
    'Document Shortfall': '!bg-[#FFEFD4] !text-[#694200] !border-[#FEC76A]',
  };
  const { initialData } = useInitialData();
  let dateTimeFormat = initialData?.app_config?.datetime_format;
  let dateFormat = initialData?.app_config?.date_format;
  //
  return (
    <div
      onMouseEnter={() => setShowDetailsBtn(true)}
      onMouseLeave={() => setShowDetailsBtn(false)}
      className={`relative flex  w-[317px]   rounded-lg border border-primary-border px-4  pt-4 pb-6 ${
        showDetailsBtn ? 'border-[#8485F6] shadow-primary transition duration-[200ms] ease-in' : ''
      }`}
    >
      <div className="absolute right-4 top-4">
        <EditCardMenu editUrl={editUrl}></EditCardMenu>
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-sans-pro text-lg font-semibold tracking-[-0.2px] !text-black">
          {name}
        </span>
        {/* {description === "" ? "-" : description} */}
        <span className="font-lato text-xs font-normal tracking-[0.2px] !text-black">
          {description === '' ? 'Description: NA' : description}
        </span>
        <div
          className={`text  flex h-fit w-fit items-center justify-center rounded-full  border py-[5px] px-2 font-lato text-[9px] font-bold leading-[8px] tracking-[0.2px] ${
            statusStyles[status]
          }  ${showDetailsBtn ? '' : ''}`}
        >
          {status.toUpperCase()}
        </div>
        <div
          className={` flex flex-col
              ${showDetailsBtn ? 'opacity-5 transition duration-150 ease-in' : ''}`}
        >
          <p className="font-lato text-xs font-normal text-tertiary">
            Enrolled on:
            <span className="pl-1 font-lato text-xs font-bold tracking-[0.2px] text-black">
              {/* {date_enrolled} */}
              {moment(date_enrolled, dateTimeFormat).format(dateFormat)}
            </span>
          </p>
          <p className="font-lato text-xs font-normal text-tertiary">
            by:
            <span className="pl-1 font-lato text-xs font-bold tracking-[0.2px] text-black">
              {enrolled_by}
            </span>
          </p>
        </div>
      </div>
      <div
        className={`absolute bottom-6 left-0 right-0 h-fit w-full transition duration-[200ms] ease-in ${
          !showDetailsBtn ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span
          onClick={() => window.open(url, '_blank')}
          className="flex h-7 w-full cursor-pointer items-center justify-center rounded  font-lato text-xs font-bold !text-primary-action"
        >
          View Details
        </span>
      </div>
    </div>
  );
};

export default EnrolledCard;
