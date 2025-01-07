import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
const Toggle = ({
  label,
  labelStyle = undefined,
  defaultState,
  isTag,
  isTagToggle,
  setOpenModal,
  setIsTagToggle,
  statusId,
  setStatusId,
}: {
  isTag: boolean;
  label: string;
  labelStyle: string | undefined;
  defaultState: boolean;
  isTagToggle: boolean | undefined;
  statusId: number | undefined;
  setOpenModal: Dispatch<SetStateAction<boolean>> | undefined;
  setIsTagToggle: Dispatch<SetStateAction<boolean>> | undefined;
  setStatusId: Dispatch<SetStateAction<number>> | undefined;
}) => {
  const [localToggle, setLocalToggle] = useState<boolean>(isTagToggle ? isTagToggle : defaultState);
  return (
    <div className="flex items-center justify-between pr-[14px]">
      <Switch.Group>
        <Switch.Label className={labelStyle}>{label}</Switch.Label>
        <Switch
          checked={localToggle}
          onChange={() => {
            setLocalToggle(!localToggle);
            setIsTagToggle && setIsTagToggle(!isTagToggle);
            setOpenModal && setOpenModal(true);
            setStatusId && statusId && setStatusId(statusId);
          }}
          // onClick={() => setOpenM  odal && setOpenModal(true)}
          className={`${
            isTagToggle !== undefined
              ? isTagToggle
                ? 'border-gray-600 bg-gray-600'
                : 'border-tertiary bg-white'
              : localToggle
              ? 'border-gray-600 bg-gray-600'
              : 'border-tertiary bg-white'
          }
      relative inline-flex h-4 w-[26px] shrink-0 cursor-pointer items-center rounded-full border   transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden="true"
            className={`${
              isTagToggle !== undefined
                ? isTagToggle
                  ? 'translate-x-[13px] bg-white'
                  : 'translate-x-[3px] bg-gray-600'
                : localToggle
                ? 'translate-x-[13px] bg-white'
                : 'translate-x-[3px] bg-gray-600'
            }
          duration-400 pointer-events-none inline-block h-2 w-2 transform rounded-full shadow-lg ring-0 transition ease-in-out`}
          />
        </Switch>
      </Switch.Group>
    </div>
  );
};

export default Toggle;
