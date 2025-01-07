import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useInitialData } from 'context/InitialDataContext';

const BreadCrums = () => {
  const { programId } = useParams();
  const { initialData } = useInitialData();
  return (
    <div className="flex gap-[5px] ">
      <NavLink
        className="font-lato text-xs font-[800] tracking-[0.2em]"
        style={({ isActive }) => {
          return { color: isActive ? '#212429' : '#C7CED3' };
        }}
        to="/"
      >
        Patients
      </NavLink>
      <NavLink
        className="font-lato text-xs font-[800] tracking-[0.2em]"
        style={({ isActive }) => {
          return { color: isActive ? '#212429' : '#C7CED3' };
        }}
        to="/"
      >
        {/* / {initialData?.patient_details?.profile?.name} */}
      </NavLink>
      <NavLink
        className="font-lato text-xs font-[800] tracking-[0.2em]"
        style={({ isActive }) => {
          return { color: isActive ? '#212429' : '#C7CED3' };
        }}
        to={`/ProgramDetails/${programId}`}
      >
        /{' '}
        {/* {initialData?.programs?.data.map((enrolled) => {
          if (enrolled.type === 'Enrolled') {
            return (
              enrolled?.total_programs &&
              enrolled?.total_programs.map((prg) => {
                if (prg.program_id === programId) {
                  return prg.program_describtion;
                } else {
                  return null;
                }
              })
            );
          } else {
            return null;
          }
        })} */}
      </NavLink>
    </div>
  );
};

export default BreadCrums;
