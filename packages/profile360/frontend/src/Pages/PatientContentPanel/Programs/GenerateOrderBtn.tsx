import React from 'react';
import { ReactComponent as CartIcon } from '../../../assests/images/Cart.svg';
import { Dispatch, SetStateAction } from 'react';
interface BtnProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
}
const GenerateOrderBtn: React.FC<BtnProps> = ({ showModal, setShowModal }) => {
  return (
    <>
      <div
        className="cursor-pointer rounded bg-primary-action px-4 py-2"
        onClick={() => setShowModal(!showModal)}
      >
        <div className="flex items-center gap-[9px]">
          <span className="font-lato text-sm font-bold tracking-[0.2px] text-white">
            Generate Order
          </span>
          <CartIcon />
        </div>
      </div>
    </>
  );
};

export default GenerateOrderBtn;
