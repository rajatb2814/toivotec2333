import { useField } from 'formik';
import { FormEvent, useEffect, useRef } from 'react';
import { handleTextAreaHeight } from 'utils/helpers';

export const TextField = ({ label, ...props }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [field, meta] = useField(props);
  useEffect(() => {
    if (textareaRef) {
      handleTextAreaHeight(textareaRef.current, '49px');
    }
  }, [textareaRef]);
  //
  return (
    <div className="flex  flex-col items-start gap-1">
      <label
        htmlFor={props.id || props.name}
        className="text-start font-lato text-[11px] font-semibold leading-4 tracking-[0.2px] text-neutral-400"
      >
        {label}
      </label>
      <textarea
        ref={textareaRef}
        className={`invisible-scrollbar h-[49px] w-full resize-none  rounded-md border px-4 pt-4 pb-[13px] font-lato text-sm leading-5 text-neutral-700 focus-visible:outline-none disabled:bg-secondary disabled:text-neutral-400 ${
          meta.touched && meta.error ? 'border-red-400' : 'border-primary-border'
        }`}
        {...field}
        {...props}
        disabled={props?.config ? props?.config?.isReadOnly : false}
        type="number"
        onChangeCapture={(event) => handleTextAreaHeight(event, '49px')}
      />
      {meta.touched && meta.error ? (
        <div className=" font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextField;
