import React from 'react';
import GenerateOrderBtn from 'Pages/PatientContentPanel/Programs/GenerateOrderBtn';
import { useState } from 'react';
const Orders = () => {
  const [test, setTest] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <p className="pl-8 font-sans-pro text-lg font-semibold tracking-[-0.2px]"> Orders</p>
      <div className="flex w-full justify-end pr-8 pt-4">
        <GenerateOrderBtn showModal={test} setShowModal={setTest} />
      </div>
    </div>
  );
};

export default Orders;
