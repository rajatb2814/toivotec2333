import { filter } from 'lodash';
import React from 'react';
import { useState, useEffect } from 'react';
const Filters = ({
  filters,
  setfiltersArr,
  filtersArr,
  defaultCheck,

  filterInfo,
}: {
  filters: string | undefined;
  setfiltersArr: React.Dispatch<React.SetStateAction<string[]>>;
  filtersArr: string[];
  defaultCheck: boolean;

  filterInfo: {
    count: number | undefined;
    isDisabled: boolean;
  };
}) => {
  const [isChecked, setIsChecked] = useState<Boolean>(false);
  useEffect(() => {
    if (defaultCheck === true) {
      setIsChecked(true);
      setfiltersArr([...filtersArr, 'All']);
    }
  }, []);
  return (
    <>
      <input
        type="checkbox"
        id={filters}
        name={filters}
        className="filterCheckbox h-0 w-0 "
        defaultChecked={defaultCheck}
        onChange={(e) => {
          setIsChecked(e.currentTarget.checked);

          if (isChecked) {
            setfiltersArr(filtersArr.filter((i) => i !== e.currentTarget.name));
          } else {
            setfiltersArr([...filtersArr, e.currentTarget.name]);
          }
        }}
        disabled={filterInfo.isDisabled}
      />
      <label
        htmlFor={filters}
        className={` flex cursor-pointer items-center justify-center rounded-[13px] border border-neutral-700 px-3 py-1 font-lato text-xs font-normal tracking-[0.2px] disabled:bg-red-400 ${
          isChecked ? 'bg-neutral-700 text-white' : ''
        } ${filterInfo.isDisabled ? 'border-none bg-secondary font-bold opacity-50' : ''}`}
      >
        {`${filters} (${filterInfo.count ? filterInfo.count : '0'}) `}
      </label>
    </>
  );
};

export default Filters;
