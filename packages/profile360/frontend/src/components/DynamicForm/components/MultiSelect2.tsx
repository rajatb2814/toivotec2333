import React, { useEffect, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useField } from 'formik';
import { usePopper } from 'react-popper';
import { ReactComponent as IconSelectDropdown } from '../../../assests/images/select-dropdown.svg';
import { ReactComponent as IconSelectTick } from '../../../assests/images/select-tick.svg';

const people = [
  { label: 'Wade Cooper', value: 1 },
  { label: 'Wade Cooper1', value: 2 },
  { label: 'Wade Cooper2', value: 3 },
  { label: 'Wade Cooper3', value: 4 },
  { label: 'Wade Cooper4', value: 5 },

  //   'Arlene Mccoy',
  //   'Devon Webb',
  //   'Tom Cook',
  //   'Tanya Fox',
  //   'Hellen Schmidt',
  //   'Caroline Schultz',
  //   'Mason Heaney',
  //   'Claudie Smitham',
  //   'Emil Schaefer',
];

const MultiSelect2 = ({ label, formik, optionsData, ...props }: any) => {
  const [field, meta] = useField(props);
  const [referenceElement, setReferenceElement] = useState(null);

  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>(props.value ? props.value : []);

  //check if a value is selected or not
  function isSelected(value: any) {
    return selectedOption.find((el: any) => el.value === value) ? true : false;
  }

  //custom hook for handling outside click
  function useOutsideClick(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  // handleSelection of options
  function handleSelect(value: any) {
    if (!isSelected(value)) {
      const selectedOptionUpdated = [
        ...selectedOption,
        optionsData.find((el: any) => el.value === value),
      ];
      let optionsValue = selectedOptionUpdated.map((obj: any) => obj.value);
      formik.setFieldValue(props.id, optionsValue);
      setSelectedOption(selectedOptionUpdated);
    } else {
      handleDeselect(value);
    }
    setIsOpen(true);
  }

  //Pre fill multiselect if any values
  useEffect(() => {
    let tempArr: any = [];

    if (props.value) {
      optionsData?.map((options: any, key: number) => {
        if (props.value.includes(options.value)) {
          tempArr.push({ label: options.label, value: options.value });
        }
      });
    }
    setSelectedOption(tempArr);
  }, []);

  //Deselect selected values
  function handleDeselect(value: any) {
    const selectedOptionUpdated = selectedOption.filter((el: any) => el.value !== value);
    setSelectedOption(selectedOptionUpdated);
    setIsOpen(true);
  }

  //handle outside clicks
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  return (
    <div className="flex flex-col items-start gap-1">
      <label
        htmlFor={props.id || props.name}
        className="text-start font-lato text-xs font-semibold leading-[14px] tracking-[0.64px] text-neutral-400"
      >
        {label}
      </label>
      <div className=" w-full ">
        <Listbox
          as="div"
          className="space-y-1"
          value={selectedOption}
          disabled={props?.config ? props?.config?.isReadOnly : false}
          onChange={(value) => handleSelect(value)}
        >
          {({ open }) => (
            <>
              <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                  <Listbox.Button
                    {...field}
                    className={` w-full rounded-md border  px-4 pt-4 pb-[13px] font-lato text-sm leading-5 tracking-[0.2px] text-neutral-700  disabled:cursor-default  disabled:bg-secondary disabled:!text-neutral-400 ${
                      meta.touched && meta.error ? 'border-red-400' : 'border-primary-border'
                    } `}
                    onClick={() => setIsOpen(!isOpen)}
                    ref={(ref: any) => setReferenceElement(ref)}
                  >
                    <span
                      className={`block w-[370px] truncate text-left text-sm  ${
                        selectedOption.length < 1 ? 'text-[#a4acb2]' : 'text-neutral-700'
                      } `}
                    >
                      {selectedOption.length < 1
                        ? 'Tags'
                        : ` ${selectedOption.map((tag: any, key: any) => {
                            if (key === 0) {
                              return tag.label;
                            } else {
                              return tag.label;
                            }
                          })}`}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <IconSelectDropdown
                        className={` duration-250 transition-all ${
                          popperElement ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </span>
                  </Listbox.Button>
                </span>

                <Transition
                  // unmount={false}
                  show={isOpen}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
                  //@ts-ignore
                  ref={setPopperElement}
                  style={styles['popper']}
                  {...attributes['popper']}
                >
                  <Listbox.Options
                    static
                    ref={wrapperRef}
                    // className="shadow-xs  overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
                    className="invisible-scrollbar z-[100] h-fit max-h-96 w-full overflow-y-auto rounded-md border border-primary-border bg-white py-6 text-base ring-1 ring-black ring-opacity-5 drop-shadow-2xl focus:outline-none sm:text-sm"
                  >
                    {optionsData.map((tag: any) => {
                      const selected = isSelected(tag.value);
                      return (
                        <Listbox.Option
                          key={tag.value}
                          value={tag.value}
                          disabled={tag.unavailable || false}
                        >
                          {({ active }) => (
                            <div
                              className={`relative cursor-pointer select-none   rounded-sm py-2 px-6 text-start hover:bg-secondary  ${
                                active ? 'text-black ' : 'text-neutral-700'
                              }${tag.unavailable ? 'cursor-default hover:bg-white' : ''}`}
                            >
                              <span
                                className={`block truncate px-6 ${
                                  selected || selected
                                    ? ' font-semibold text-neutral-700'
                                    : 'font-normal text-neutral-600'
                                }
                                ${tag.unavailable ? 'text-[#a4acb2]' : ''}
                               `}
                              >
                                {tag.label}
                              </span>
                              {selected && !tag.unavailable && (
                                <span
                                  className={` absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <IconSelectTick />
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>

                {/* <div className="pt-1 text-sm">
                  {selectedPersons.length > 0 && (
                    <>Selected persons: {selectedPersons.join(', ')}</>
                  )}
                </div> */}
              </div>
            </>
          )}
        </Listbox>
      </div>
    </div>
  );
};
export default MultiSelect2;
