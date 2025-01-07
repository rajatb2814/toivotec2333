import { useInitialData } from 'context/InitialDataContext';
import { TagsInterface } from '..';
import ToggleTagsAndModals from './ToggleTagsAndModals';

const Tags = ({ apiData }: { apiData: TagsInterface[] | undefined }) => {
  const { initialData } = useInitialData();

  let defaultTags = apiData?.map((tag, idx) => tag.label);
  return (
    <>
      <div className="flex h-fit w-full flex-col gap-2 px-8 pt-3">
        {initialData?.tags?.enabled &&
          initialData?.tags?.options?.map((tagLabel, index) => {
            let defaultState = defaultTags?.includes(tagLabel?.label);
            return (
              <ToggleTagsAndModals
                label={tagLabel?.label}
                defaultState={defaultState ? defaultState : false}
                tagId={tagLabel?.id}
                key={index}
              />
            );
          })}
      </div>
    </>
  );
};
export default Tags;
