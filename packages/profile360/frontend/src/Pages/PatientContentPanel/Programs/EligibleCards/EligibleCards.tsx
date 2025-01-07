import { ProgramsInterface } from 'Pages/PatientSideBar/EnrolledPrograms';
import { useInitialData } from 'context/InitialDataContext';
import React from 'react';
import EligibleCard from './EligibleCard';

const EligibleCards = ({ prgData }: { prgData: ProgramsInterface }) => {
  const { initialData } = useInitialData();
  return (
    <>
      {initialData?.programs?.enabled &&
        prgData.map((prg_data, key) => {
          if (prg_data.type === 'Eligible') {
            return (
              <div key={key} className="flex  flex-wrap gap-4">
                {prg_data.total_programs &&
                  prg_data.total_programs.map((eligible_prg, key) => {
                    return (
                      <React.Fragment key={key}>
                        <EligibleCard
                          name={eligible_prg.program_name}
                          description={eligible_prg.description}
                          url={eligible_prg.apply_url}
                          is_eligible={eligible_prg.is_eligible}
                          editUrl={eligible_prg.edit_url}
                        />
                      </React.Fragment>
                    );
                  })}
              </div>
            );
          } else {
            return null;
          }
        })}
    </>
  );
};

export default EligibleCards;
