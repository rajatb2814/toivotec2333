import { useInitialData } from 'context/InitialDataContext';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EditAddressFormSchema } from '..';
import { ReactComponent as PhoneIcon } from '../../../assests/images/Phone.svg';
import AddressModal from '../AddressForms/AddressModal';
import CallModal from '../PatientInfo/CallModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/scale-extreme.css';
import 'tippy.js/dist/tippy.css';
interface PatientDetailsProps {
  title: string;
  value: string;
  type: string;
  url: string;
  key: number;
}

export const DetailsLabel = ({ label }: { label: String }) => {
  return <p className="font-lato text-xs font-normal text-tertiary">{label}</p>;
};

export const DetailsValue = ({ value }: { value: String | undefined }) => {
  return (
    <h2 className="h2 w-full truncate font-lato text-xs font-bold text-neutral-600">
      {value && value}
    </h2>
  );
};
export const PatientDetailsTest = ({ title, value, type, url, key }: PatientDetailsProps) => {
  const [toolTip, setToolTip] = useState<boolean>(false);
  const detailValue = useRef<any>();
  useLayoutEffect(() => {
    console.log(type);
    // console.log(detailValue.current);
    if (detailValue.current && detailValue.current.offsetWidth >= 239) {
      console.log(detailValue.current.textContent, detailValue.current.offsetWidth);
      console.log('true');
      setToolTip(true);
    } else {
      setToolTip(false);
    }
  }, []);
  return (
    <Fragment key={key}>
      {title.includes('Phone') ? (
        value !== null && value !== '' ? (
          <div key={key}>
            <PatientDetailsPhoneNo label={title} value={value} callUrl={url} />
          </div>
        ) : (
          <div key={key}>
            <PatientDetailsPhoneNo label={title} value={'NA'} callUrl={url} />
          </div>
        )
      ) : (
        <Tippy
          content={
            <div className="rounded !px-0 !py-0   font-lato text-xs font-bold text-white ">
              {value ? value : 'NA'}
            </div>
          }
          animation="fade"
          inertia={true}
          interactive={true}
          arrow={false}
          placement={'right'}
          className="break-all px-3 py-2"
          maxWidth={400}
          disabled={!toolTip}
        >
          <div key={key} className="px-8 py-1">
            <p className="font-lato text-xs font-normal text-tertiary">{title}</p>
            {value !== null && value !== '' ? (
              <div className="h2 max-w-full truncate font-lato text-xs font-bold text-neutral-600">
                {type === 'Email' ? (
                  <a
                    ref={detailValue}
                    href={'mailto:' + url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-lato text-xs font-bold text-neutral-600"
                  >
                    {value}
                  </a>
                ) : (
                  <>
                    {type === 'File' && url !== 'NA' ? (
                      <a
                        ref={detailValue}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="cursor-pointer  font-lato  font-bold  tracking-[0.2px] !text-primary-action"
                      >
                        {value}
                      </a>
                    ) : (
                      <span ref={detailValue}>{value}</span>
                    )}
                  </>
                )}
              </div>
            ) : (
              <Fragment key={key}>
                <h2 className="h2 w-full  font-lato text-xs font-bold text-neutral-600">NA</h2>
              </Fragment>
            )}
          </div>
        </Tippy>
      )}
    </Fragment>
  );
};
export const PatientDetailsPhoneNo = ({
  label,
  value,
  callUrl,
}: {
  label: String;
  callUrl: string | undefined;
  value: String | undefined;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { initialData } = useInitialData();

  return (
    <>
      {' '}
      <div className={`px-8 py-1  ${value !== 'NA' ? 'hover:bg-[#F0F3F4]' : ''}`}>
        <div className="flex justify-between">
          <div>
            <p className="font-lato text-xs font-normal text-tertiary">{label}</p>
            <h2 className="h2 font-lato text-xs font-bold text-neutral-600">{value && value}</h2>
          </div>
          <div className="flex items-center ">
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer text-xs font-bold tracking-[0.2px] text-primary-action hover:underline disabled:cursor-default disabled:opacity-50"
              disabled={value === 'NA' || !initialData?.integrations?.telephony?.enabled}
            >
              <PhoneIcon />
            </button>
          </div>
        </div>
      </div>
      <CallModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={`Call ${value}`}
        url={callUrl}
        modalMessage={'Are you sure you want to make this call?'}
        sucessBtn={'Yes'}
        cancelBtn={'No'}
      />
    </>
  );
};

export const Address = ({
  name,
  address,
  isPrimary,
  addressId,
  formSchema,
}: {
  address: String | undefined;
  name: String | undefined;
  isPrimary: boolean | undefined;
  addressId: number;
  formSchema: EditAddressFormSchema;
}) => {
  const { initialData } = useInitialData();

  const addressLabel = useRef<any>();
  const nameLabel = useRef<any>();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [labelWidth, setLabelWidth] = useState<boolean>(true);
  const [toolTip, setToolTip] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (
      addressLabel.current &&
      addressLabel.current.offsetWidth + nameLabel.current.offsetWidth >= 205
    ) {
      setLabelWidth(false);
    } else {
      setLabelWidth(true);
    }

    if (nameLabel.current.scrollWidth <= nameLabel.current.offsetWidth) {
      setToolTip(true);
    } else {
      setToolTip(false);
    }
  }, []);

  return (
    <div className=" flex flex-col  transition duration-[175ms] ease-in hover:bg-secondary">
      <div className="flex flex-col gap-1 py-1 pl-8 pr-4">
        <div className="flex justify-between  pr-5">
          <div
            className={`flex  ${
              labelWidth ? 'items-center gap-1 ' : 'flex-col items-start justify-start'
            }`}
          >
            <Tippy
              content={
                <div className=" rounded !px-0 !py-0   font-lato text-xs font-bold text-white ">
                  {name}
                </div>
              }
              animation="fade"
              inertia={true}
              interactive={true}
              arrow={false}
              placement={'right'}
              className="px-3 py-2 opacity-90"
              maxWidth={'none'}
              disabled={toolTip}
            >
              <span
                ref={nameLabel}
                className={` ${
                  isPrimary ? (labelWidth ? 'max-w-[150px]' : 'max-w-[199px]') : 'max-w-[199px]'
                } truncate font-lato text-xs font-bold text-neutral-600`}
              >
                {name}
              </span>
            </Tippy>
            {isPrimary ? (
              <div
                ref={addressLabel}
                className="flex-grow-[2] font-lato text-xs font-normal text-neutral-600"
              >
                ({initialData?.address?.is_primary_label})
              </div>
            ) : null}
          </div>

          <div
            className={` flex ${
              labelWidth ? 'items-center' : 'items-start'
            }  transition duration-[175ms] ease-in `}
          >
            {initialData?.address?.allow_edit && (
              <div
                className="cursor-pointer text-xs font-bold tracking-[0.2px] text-primary-action hover:underline"
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              >
                Edit
              </div>
            )}
            {/* <DotMenuBtn className="h-4 w-4 cursor-pointer" /> */}
          </div>
        </div>
        <h2 className=" break-words font-lato text-xs font-bold text-neutral-600">{address}</h2>
        <AddressModal
          modalTitle="Edit New Address"
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
          formSchema={formSchema}
          isEdit={true}
          editAddress={{ modalName: name, modalAddress: address, modalIsPrimary: isPrimary }}
          addressId={addressId}
        />
      </div>
    </div>
  );
};
