import { useInitialData } from 'context/InitialDataContext';
import React, { useState } from 'react';
import { EditCardMenu } from '../EditCardMenu';

interface EligibleCardProps {
  name?: string;
  description?: string;
  url?: string;
  is_eligible?: boolean;
  editUrl?: string;
}

const EligbleCard: React.FC<EligibleCardProps> = ({
  name,
  description,
  url,
  is_eligible,
  editUrl,
}): JSX.Element => {
  const [showDetailsBtn, setShowDetailsBtn] = useState<Boolean>(false);
  const { initialData } = useInitialData();
  return (
    <>
      {initialData?.programs?.can_apply && is_eligible ? (
        <div
          onMouseEnter={() => setShowDetailsBtn(true)}
          onMouseLeave={() => setShowDetailsBtn(false)}
          className={`relative w-[317px] rounded-lg border border-primary-border px-4 pt-4 pb-6  transition duration-[200ms] ease-in ${
            showDetailsBtn ? 'border-[#8485F6] shadow-primary' : ''
          }`}
        >
          <div className="absolute right-4 top-4">
            <EditCardMenu editUrl={editUrl}></EditCardMenu>
          </div>
          <div className="flex h-fit w-full flex-col gap-3">
            <span className="font-sans-pro text-lg font-semibold tracking-[-0.2px] !text-black">
              {name}
            </span>
            <span
              className={`w-[169px] font-lato text-xs font-normal tracking-[0.2px] !text-black  transition duration-[200ms] ease-in ${
                showDetailsBtn ? 'opacity-5' : ''
              }`}
            >
              {description && description}
            </span>
          </div>
          {initialData?.programs?.can_apply && is_eligible && (
            <span
              onClick={() => window.open(url, '_blank')}
              className={`
            ${
              !showDetailsBtn ? 'opacity-0' : 'opacity-100'
            } absolute right-0 left-0 bottom-6  flex h-[30px] w-full cursor-pointer items-center justify-center rounded  px-4 py-2 font-lato text-xs font-bold !text-primary-action transition duration-[200ms]  ease-in`}
            >
              View Details
            </span>
          )}
        </div>
      ) : (
        <div

        // className={`${!initialData?.programs?.can_apply ? '' : 'pointer-events-none'}`}
        >
          <div
            onMouseEnter={() => setShowDetailsBtn(true)}
            onMouseLeave={() => setShowDetailsBtn(false)}
            className={`relative w-[317px] rounded-lg border border-primary-border px-4 pt-4 pb-6  transition duration-[200ms] ease-in ${
              showDetailsBtn ? 'border-[#8485F6] shadow-primary' : ''
            }`}
          >
            <div className="flex h-fit w-full flex-col gap-3">
              <span className="font-sans-pro text-lg font-semibold tracking-[-0.2px] !text-black">
                {name}
              </span>
              <span
                className={`w-[169px] font-lato text-xs font-normal tracking-[0.2px] !text-black  transition duration-[200ms] ease-in ${
                  showDetailsBtn ? 'opacity-5' : ''
                }`}
              >
                {description && description}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default EligbleCard;
