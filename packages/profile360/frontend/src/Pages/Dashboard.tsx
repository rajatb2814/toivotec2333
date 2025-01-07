import React, { createContext, useEffect, useState } from 'react';
import { PatientDisplay } from './PatientContentPanel';
import { PatientInfobar } from './PatientSideBar';
import DismissableToast from '../components/CustomToast';
//@ts-ignore
export const UpdateAppContext = createContext();

function Dashboard() {
  const [renderOnUpdate, setRenderOnUpdate] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const toggleRenderOnUpdate = () => {
    setRenderOnUpdate((renderOnUpdate) => !renderOnUpdate);
    setIsLoaded(false);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, [renderOnUpdate]);
  if (!isLoaded) {
    return null;
  } else {
    return (
      <>
        <UpdateAppContext.Provider value={{ toggleRenderOnUpdate }}>
          <div className="flex h-full grow flex-col ">
            <div className="flex h-[calc(100vh-48px)] grow  bg-white">
              <PatientInfobar />
              <PatientDisplay />
            </div>
          </div>
        </UpdateAppContext.Provider>
      </>
    );
  }
}

export default Dashboard;
