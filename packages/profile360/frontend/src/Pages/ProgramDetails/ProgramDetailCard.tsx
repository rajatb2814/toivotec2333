import React from 'react';
import { useInitialData } from 'context/InitialDataContext';
import { ReactComponent as DotMenuBtn } from '../../assests/images/dot-menu-btn.svg';

const ProgramDetailCard = ({ programId }: { programId: string | undefined }) => {
  const { initialData } = useInitialData();

  return (
    <>
      {/* {initialData?.programs?.enabled &&
        initialData?.programs?.data.map((programs) => {
          if (programs.type === 'Enrolled') {
            return (
              <>
                {programs.total_programs &&
                  programs.total_programs.map((enrolled, key) => {
                    if (enrolled.program_id === programId) {
                      return (
                        <DetailCard
                          programName={enrolled.program_describtion}
                          programStatus={enrolled.status}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
              </>
            );
          }
        })} */}
      return null
    </>
  );
};

const DetailCard = ({
  programName,
  programStatus,
}: {
  programName: string | undefined;
  programStatus: string | undefined;
}) => {
  const CheckStatus = () => {
    return programStatus === 'Active';
  };
  return (
    <div className="flex flex-col gap-1 pt-6">
      <div className="flex gap-[22px]">
        <div className="w-[227px] font-sans-pro text-[22px] font-semibold leading-7 tracking-[-0.2px]">
          {programName}
        </div>
        <DotMenuBtn className="cursor-pointer" />
      </div>
      <div
        className={`flex h-fit w-fit items-center justify-center rounded-full py-[5px] px-2  font-lato text-xs font-medium tracking-[0.4px] text-white ${
          CheckStatus() ? 'bg-[#2CBE90]' : 'bg-red-400'
        } `}
      >
        {CheckStatus() ? 'Active' : 'Inactive'}
      </div>
      <div>
        <span className="font-lato text-xs text-tertiary">Approved by: </span>
        <span className="fonnt-lato text-xs font-bold text-neutral-600">Jenny Wilson</span>
      </div>
      <span>
        <span className="font-lato text-xs text-tertiary">Approved on: </span>
        <span className="fonnt-lato text-xs font-bold text-neutral-600"> 23 Mar 2022, 19:20 </span>
      </span>
    </div>
  );
};
export default ProgramDetailCard;
