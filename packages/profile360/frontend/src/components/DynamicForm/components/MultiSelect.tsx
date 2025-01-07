import { useField } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';

import { ReactComponent as IconSelectTick } from '../../../assests/images/select-tick.svg';
import { ReactComponent as IconSelectDropdown } from '../../../assests/images/select-dropdown.svg';

const MultiSelectField = ({ label, formik, optionsData, value, ...props }: any) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const [selectedOption, setSelectedOption] = useState([
    optionsData?.[0] || { label: 'Select', value: '', unavailable: true },
  ]);
  const [field, meta] = useField(props);
  function isSelected(value: any) {
    return selectedOption.find((el: any) => el.id === value.id) ? true : false;
  }
  const handleChange = (value: any) => {
    if (!isSelected(value)) {
      let optionsValue = value.map((obj: any) => obj.value);
      formik.setFieldValue(props.id, optionsValue);
      setSelectedOption(value);
    }
  };
  const deSelectOption = (value: any) => {
    const selectedOptionUpdated = selectedOption.filter((el) => el !== value.id);
    setSelectedOption(selectedOptionUpdated);
  };
  useEffect(() => {
    let tempArr: any = [];

    if (value) {
      optionsData?.map((options: any, key: number) => {
        if (value.includes(options.value)) {
          tempArr.push({ label: options.label, value: options.value });
        }
      });
      setSelectedOption(tempArr);
    } else {
      setSelectedOption([optionsData?.[0]]);
    }
  }, []);

  useEffect(() => {}, [popperElement]);

  return (
    <div className="flex flex-col items-start gap-1">
      <label
        htmlFor={props.id || props.name}
        className="text-start font-lato text-xs font-semibold leading-[14px] tracking-[0.64px] text-neutral-400"
      >
        {label}
      </label>
      <div className="w-full">
        <Listbox
          value={selectedOption}
          onChange={handleChange}
          disabled={props?.config ? props?.config?.isReadOnly : false}
          multiple={true}
        >
          <div className="relative">
            <Listbox.Button
              {...field}
              className={` w-full rounded-md border  px-4 pt-4 pb-[13px] font-lato text-sm leading-5 tracking-[0.2px] text-neutral-700  disabled:cursor-default  disabled:bg-secondary disabled:!text-neutral-400 ${
                meta.touched && meta.error ? 'border-red-400' : 'border-primary-border'
              } `}
              ref={(ref: any) => setReferenceElement(ref)}
            >
              {
                <span className={`block w-[370px] truncate text-left text-sm  text-neutral-700`}>
                  {selectedOption.map((selectedOptionLabels, key) => {
                    if (key === 0) {
                      if (selectedOptionLabels.unavailable === true) {
                        return <span className="text-[#a4acb2]">{selectedOptionLabels.label}</span>;
                      } else {
                        return selectedOptionLabels.label;
                      }
                    } else {
                      return ', ' + selectedOptionLabels.label;
                    }
                  })}
                </span>
              }
              <span
                className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 `}
              >
                <IconSelectDropdown
                  className={` duration-250 transition-all ${
                    popperElement ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              // @ts-ignore
              ref={setPopperElement}
              style={styles['popper']}
              {...attributes['popper']}
            >
              <Listbox.Options className="invisible-scrollbar absolute z-[100] h-fit max-h-96 w-full overflow-y-auto rounded-md border border-primary-border bg-white py-6 text-base ring-1 ring-black ring-opacity-5 drop-shadow-2xl focus:outline-none sm:text-sm">
                {optionsData?.map(
                  (
                    eachOption: { label: string; value: string | number; unavailable?: boolean },
                    personIdx: number
                  ) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-pointer select-none rounded-sm py-2 px-6 text-start hover:bg-secondary  ${
                          active ? 'text-black ' : 'text-neutral-700'
                        } ${eachOption.unavailable ? 'cursor-default hover:bg-white' : ''}`
                      }
                      value={eachOption}
                      disabled={eachOption.unavailable || false}
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={`block truncate px-6 ${
                              selected || selected
                                ? ' font-semibold text-neutral-700'
                                : 'font-normal text-neutral-600'
                            }${active ? 'bg-red-300' : 'bg-gray-600'}
                             ${eachOption.unavailable || false ? 'opacity-50' : 'cursor-pointer'}`}
                          >
                            {eachOption.label}
                          </span>
                          {selected && !eachOption.unavailable ? (
                            <span className="absolute inset-y-0 left-4 flex items-center">
                              <IconSelectTick />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  )
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {meta.touched && meta.error ? (
        <div className=" font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default MultiSelectField;
