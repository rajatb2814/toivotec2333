import { useField } from 'formik';
import { number } from 'yup';

export const TextField = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex  flex-col items-start gap-1">
      <label
        htmlFor={props.id || props.name}
        className="text-start font-lato text-xs font-semibold leading-[14px] tracking-[0.64px] text-neutral-400"
      >
        {label}
      </label>
      <input
        className={` w-full rounded-md border  px-4 pt-4 pb-[13px] font-lato text-sm leading-5 tracking-[0.2px] text-neutral-700 focus-visible:outline-none disabled:bg-secondary disabled:text-neutral-400 ${
          meta.touched && meta.error ? 'border-red-400' : 'border-primary-border'
        } `}
        {...field}
        {...props}
        disabled={props?.config ? props?.config?.isReadOnly : false}
      />

      {meta.touched && meta.error ? (
        <div className=" font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextField;
