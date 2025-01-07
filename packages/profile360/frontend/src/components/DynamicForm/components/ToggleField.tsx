import { useState } from 'react';
import { Switch } from '@headlessui/react';

import { useField } from 'formik';

export const ToggleField = ({ label, formik, ...props }: any) => {
  const [field, meta] = useField(props);
  const [enabled, setEnabled] = useState(props.value || false);

  const handleChange = (value: boolean) => {
    //
    setEnabled(value);
    formik.setFieldValue(props.id, value);
  };
  return (
    <div className="my-1 flex flex-col items-start gap-1">
      <div className="flex w-6/12 flex-row items-center justify-between gap-7">
        <label
          htmlFor={props.id || props.name}
          className="text-form-label font-lato text-xs font-bold tracking-[.04em]"
        >
          {label}
        </label>
        <Switch
          {...field}
          {...props}
          checked={enabled}
          onChange={handleChange}
          disabled={props?.config ? props?.config?.isReadOnly : false}
          className={`${
            enabled ? 'bg-gradient-to-bl from-[#3185FC] to-[#31B3FC]' : 'bg-toggle-false'
          }
        relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full p-px transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-[16px]' : 'translate-x-0'}
          shadow-toggle pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>

      {meta.touched && meta.error ? (
        <div className="error text-dy-xs text-form-field-error mt-1 font-lato">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default ToggleField;
