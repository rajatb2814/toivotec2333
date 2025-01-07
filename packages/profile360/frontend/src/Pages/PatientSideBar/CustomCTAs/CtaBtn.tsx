import Tippy from '@tippyjs/react';
import { useState } from 'react';
import 'tippy.js/animations/scale-extreme.css';
import 'tippy.js/dist/tippy.css';
import { CtaOptionInterface } from '../../../types/configType';
import CtaModal from './CtaModal';

const CtaBtn = ({ ctaInfo }: { ctaInfo: CtaOptionInterface }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <Tippy
        content={
          <div className="rounded !px-0 !py-0   font-lato text-xs font-bold text-white ">
            {ctaInfo.disabled_message}
          </div>
        }
        animation="fade"
        inertia={true}
        interactive={false}
        arrow={false}
        disabled={!ctaInfo.disabled}
        placement={'right'}
        className="px-3 py-2 opacity-90"
        maxWidth={224}
      >
        <div>
          <button
            className="h-[34px] w-full rounded bg-primary-action font-lato text-sm font-bold text-white disabled:cursor-default disabled:bg-secondary disabled:text-neutral-400"
            disabled={ctaInfo.disabled}
            onClick={() => setOpenModal(true)}
          >
            {ctaInfo.label}
          </button>
        </div>
      </Tippy>
      <CtaModal
        isOpen={openModal}
        setIsOpen={setOpenModal}
        modalTitle={ctaInfo.label.toUpperCase() + '?'}
        modalMessage={ctaInfo.confirmation_message}
        sucessBtn={ctaInfo.button_2_text}
        cancelBtn={ctaInfo.button_1_text}
        ctaId={ctaInfo.id}
      />
    </>
  );
};

export default CtaBtn;
