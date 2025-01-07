import React from 'react';
import { useParams } from 'react-router-dom';
import BreadCrums from './BreadCrums';
import SideBar from 'components/SideDrawer';
import ProgramDetailCard from './ProgramDetailCard';
import Orders from './Orders';
import Table from './Table';
const ProgramDetails = () => {
  const { programId } = useParams();
  return (
    <div className=" h-fit w-full">
      <div className="flex h-full w-full">
        <div className="flex w-full flex-col ">
          <div className="w-fit pl-8 pt-4">
            <BreadCrums />
          </div>
          <section className="w-fit pl-8">
            <ProgramDetailCard programId={programId} />
          </section>
          <div className="h-full w-full flex-wrap pt-8 ">
            <Orders />
            <div>
              <Table />
            </div>
          </div>
        </div>
        <div className="  h-full">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
