import EnrolledCards from './EnrolledCards/EnrolledCards';
import EligibleCards from './EligibleCards/EligibleCards';
import { useEffect, useState } from 'react';
import { ReactComponent as UpArrow } from '../../../assests/images/UpArrow.svg';
import { ReactComponent as DownArrow } from '../../../assests/images/DownArrow.svg';
import { ProgramsInterface } from 'Pages/PatientSideBar/EnrolledPrograms';
const ProgramsGroup = ({
  label,
  type,
  count,
  prgData,
}: {
  label: string | undefined;
  type: string | undefined;
  count: number | undefined;
  prgData: ProgramsInterface;
}) => {
  const [showEligible, setShowEligible] = useState<Boolean>();
  const selectCardsType = {
    Enrolled: <EnrolledCards prgData={prgData} />,
    Eligible: <EligibleCards prgData={prgData} />,
  };
  useEffect(() => {
    prgData.map((prgs) => {
      if (prgs.type === 'Enrolled' && prgs.total_programs.length === 0) {
        setShowEligible(true);
      }
    });
  }, []);

  const checkEligible = () => {
    return type === 'Eligible';
  };
  return (
    <>
      <div className="grow  pt-8">
        {/* title */}
        <div className="relative flex items-center">
          <hr className="absolute left-0  h-3 w-[2px] bg-[#495057]"></hr>
          <div className="flex items-center gap-4">
            <div className="pl-6 font-lato text-xs font-bold uppercase leading-5 tracking-[0.6px] text-tertiary">
              {label} ({count})
            </div>
            {checkEligible() ? (
              <div
                className="flex cursor-pointer items-center gap-[7px]"
                onClick={() => setShowEligible(!showEligible)}
              >
                <div className="font-lato text-[11px] font-bold uppercase leading-4 tracking-[0.6px] text-primary-action">
                  View All
                </div>
                {showEligible ? <UpArrow /> : <DownArrow />}
              </div>
            ) : null}
          </div>
        </div>
        {/* title end  */}
        <section
          className={`flex w-fit flex-col flex-wrap pr-[22px] pl-6 pt-5  transition-all duration-500 ease-in-out ${
            checkEligible() ? (showEligible ? 'visible opacity-100 ' : 'invisible opacity-0') : ''
          }`}
        >
          {selectCardsType[type as keyof typeof selectCardsType]}
          {/* <EnrolledCards prgData={prgData}></EnrolledCards> */}
        </section>
      </div>
    </>
  );
};

export default ProgramsGroup;
