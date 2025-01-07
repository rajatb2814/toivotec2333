// /* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import Filters from '../Filters';
import { Timeline } from './Timeline';
import { useInitialData } from 'context/InitialDataContext';
import { useState } from 'react';
import { counts } from './Timeline';
import { filter } from 'lodash';
export const TimelineView = () => {
  const { initialData } = useInitialData();

  const [filtersArr, setFiltersArr] = useState<string[]>([]);
  const [filterCount, setFilterCount] = useState<counts>();

  return (
    <>
      <div className="flex flex-wrap gap-y-1 p-6">
        {initialData?.timeline_view?.components &&
          initialData?.timeline_view?.components.map((filters: string, key) => {
            return (
              <div className="flex gap-1" key={key}>
                <Filters
                  filters={filters}
                  defaultCheck={false}
                  setfiltersArr={setFiltersArr}
                  filtersArr={filtersArr}
                  filterInfo={{
                    count: filterCount && filterCount[filters as keyof counts],
                    isDisabled:
                      filterCount && filterCount[filters as keyof counts] === 0 ? true : false,
                  }}
                />
              </div>
            );
          })}
      </div>

      <Timeline filtersArr={filtersArr} setFilterCount={setFilterCount} />
    </>
  );
};
