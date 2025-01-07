import { useInitialData } from 'context/InitialDataContext';
import { ProgramsInterface } from 'Pages/PatientSideBar/EnrolledPrograms';
import React from 'react';
import EnrolledCard from './EnrolledCard';

const EnrolledCards = ({ prgData }: { prgData: ProgramsInterface }) => {
  const { initialData } = useInitialData();
  return (
    <>
      <div className="flex flex-wrap gap-4">
        {initialData?.programs?.enabled &&
          prgData.map((prg_data, key) => {
            if (prg_data.type === 'Enrolled') {
              return (
                <React.Fragment key={key}>
                  {prg_data.total_programs &&
                    prg_data.total_programs.map((enrolled_prg, key) => {
                      return (
                        <React.Fragment key={key}>
                          <EnrolledCard
                            name={enrolled_prg.program_name}
                            description={enrolled_prg.description}
                            status={enrolled_prg.program_status}
                            date_enrolled={enrolled_prg.enrollment_date}
                            enrolled_by={enrolled_prg.enrolled_by}
                            dosage={enrolled_prg.dosage}
                            programId={enrolled_prg.id}
                            url={enrolled_prg.redirection_url}
                            editUrl={enrolled_prg.edit_url}
                          ></EnrolledCard>
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            } else {
              return null;
            }
          })}
      </div>
    </>
  );
};

export default EnrolledCards;
