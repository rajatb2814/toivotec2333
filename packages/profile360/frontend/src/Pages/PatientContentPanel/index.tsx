import React from 'react';
import NavBar from './NavBar';
import SideBar from '../../components/SideDrawer';

export const PatientDisplay = () => {
  return (
    <div className="flex h-full grow">
      <NavBar />
      <SideBar />
    </div>
  );
};
