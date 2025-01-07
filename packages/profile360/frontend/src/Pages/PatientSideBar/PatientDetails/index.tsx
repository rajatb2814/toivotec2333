import React, { useLayoutEffect, useRef, useState } from 'react';

import { useInitialData } from 'context/InitialDataContext';
import AddressModal from '../AddressForms/AddressModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/scale-extreme.css';
import 'tippy.js/dist/tippy.css';
import { Address, PatientDetailsTest } from './PatientDetailsComponents';
import moment from 'moment';
import { PatientInfoBarInterface } from '..';
import { type } from '@testing-library/user-event/dist/type';

const PatientDetails = ({ apiData }: { apiData: PatientInfoBarInterface | undefined }) => {
  const { initialData } = useInitialData();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  return (
    <div className="flex  flex-col gap-4 pt-4">
      <div className="flex flex-col gap-3 ">
        {apiData?.object_details?.map(({ title, value, type, url }, key) => {
          // let label = patientDetails.title;
          // let value = patientDetails.value;
          return <PatientDetailsTest title={title} value={value} type={type} url={url} key={key} />;
        })}
      </div>

      {/* Address */}
      {initialData?.address?.enabled && apiData?.addresses ? (
        initialData?.address?.allow_multiple ? (
          <div>
            <div className="px-8">
              <p className="font-lato text-xs font-normal text-tertiary">
                {initialData?.address?.address_tab_label}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {initialData?.address?.enabled &&
                apiData?.addresses?.map((address, key) => {
                  return (
                    <div key={key}>
                      <Address
                        name={address?.name}
                        formSchema={address?.form_schema}
                        address={address?.address}
                        isPrimary={address?.is_primary}
                        addressId={address.id}
                      />
                    </div>
                  );
                })}

              {initialData?.address?.allow_create && (
                <h2
                  className="px-8  font-lato text-xs font-bold tracking-[0.2px] text-primary-action hover:cursor-pointer hover:underline"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  + Add New Address
                </h2>
              )}
              <AddressModal
                modalTitle="Add New Address"
                isOpen={isAddModalOpen}
                setIsOpen={setIsAddModalOpen}
                isEdit={false}
                formSchema={undefined}
                editAddress={{
                  modalName: undefined,
                  modalAddress: undefined,
                  modalIsPrimary: undefined,
                }}
                addressId={undefined}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {initialData?.address?.enabled && (
              <Address
                name={apiData?.addresses[0].name}
                address={apiData?.addresses[0].address}
                formSchema={apiData?.addresses[0].form_schema}
                isPrimary={apiData?.addresses[0].is_primary}
                addressId={apiData?.addresses[0].id}
              />
            )}
          </div>
        )
      ) : null}
    </div>
  );
};
export default PatientDetails;
