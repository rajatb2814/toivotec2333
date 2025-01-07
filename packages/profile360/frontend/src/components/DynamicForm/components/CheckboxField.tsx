import { useField } from 'formik';

export const CheckboxField = ({ label, value, ...props }: any) => {
  const [field, meta] = useField(props);

  return (
    <div className="my-1 flex flex-col items-start gap-1">
      <div className="relative flex cursor-pointer items-center gap-3">
        {/* {props.value ? (
          <div className="relative h-4 w-4 rounded-sm border-2 border-[#31B3FC] bg-[#31B3FC]">
            <IconToggleTick className="absolute inset-0 top-[2px] h-[8.3px] w-[11.75px]" />
          </div>
        ) : (
          <div className="h-4 w-4 rounded-sm border-2 border-[#C4C4C4]"></div>
        )} */}

        <input
          className="h-4 w-4 accent-primary-action"
          type="checkbox"
          checked={value}
          {...field}
          {...props}
        />
        <label
          htmlFor={props.id || props.name}
          className="text-form-label font-lato text-xs font-bold tracking-[.04em] text-tertiary"
        >
          {label}
        </label>
      </div>
      {meta.touched && meta.error ? (
        <div className="error text-start font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CheckboxField;
