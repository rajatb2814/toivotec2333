import React from 'react';
import CtaBtn from './CtaBtn';
import { useInitialData } from 'context/InitialDataContext';

const CustomCTAs = () => {
  const { initialData } = useInitialData();

  return (
    <>
      {initialData?.cta?.cta_enabled && (
        <div className="flex w-full flex-col gap-2 px-8 py-4">
          {initialData?.cta?.options.map((cta, key) => {
            return (
              <div className="w-full" key={key}>
                <CtaBtn ctaInfo={cta} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CustomCTAs;
