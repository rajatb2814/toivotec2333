import React, { useEffect, useState } from 'react';
import Toggle from '../Toggle';
import TagsModal from './TagsModal';
import { useInitialData } from 'context/InitialDataContext';

const ToggleTagsAndModals = ({
  label,
  defaultState,
  tagId,
}: {
  label: string;
  defaultState: boolean;
  tagId: number;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTagToggle, setIsTagToggle] = useState<boolean>(defaultState);
  const { initialData } = useInitialData();

  return (
    <div>
      <div
        className={`${initialData?.tags?.allow_edit ? '' : 'pointer-events-none cursor-default'}`}
      >
        <Toggle
          label={label}
          isTag={true}
          // label={tagLabel}
          setOpenModal={setIsOpen}
          isTagToggle={isTagToggle}
          setIsTagToggle={setIsTagToggle}
          labelStyle="font-lato text-xs font-normal tracking-[0.2px]"
          defaultState={defaultState}
          statusId={undefined}
          setStatusId={undefined}
        />
      </div>
      <TagsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isTagToggle={isTagToggle}
        modalTitle={label}
        setIsTagToggle={setIsTagToggle}
        tagId={tagId}
      />
    </div>
  );
};

export default ToggleTagsAndModals;
