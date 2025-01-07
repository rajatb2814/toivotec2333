import { useField } from 'formik';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { ReactComponent as CalendarIcon } from '../../../assests/images/calendar-icon.svg';
import moment from 'moment';
import { useState, useEffect } from 'react';

export const FormDatePicker = ({ label, formik, value, min = '1950-01-01', max, ...props }) => {
  const [date, setDate] = useState(value ? moment(value, 'YYYY-MM-DD') : '');
  const [dateFocused, setDateFocused] = useState(false);
  const [field, meta] = useField(props);
  function handleChange(date) {
    setDate(date ? date : '');
    formik.setFieldValue(props.id, moment(date) ? moment(date).format('YYYY-MM-DD') : null);
  }

  useEffect(() => {
    formik.setFieldTouched(props.id, true);
  }, [date]);

  const returnYears = () => {
    let years = [];
    for (
      let i = parseInt(moment(min).format('YYYY'));
      i <= parseInt(moment(max).format('YYYY'));
      i++
    ) {
      years.push(<option value={i}>{i}</option>);
    }
    return years;
  };

  const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    return (
      <div className="flex justify-center gap-2">
        <div>
          <select
            className="w-fit rounded border border-primary-border font-lato text-base focus:outline-none"
            value={moment(month).isBefore(moment(min)) ? moment(min).month() : month.month()}
            onChange={(e) => {
              if (month.isBefore(moment(min))) {
                onMonthSelect(moment(min), moment(min).month());
              } else {
                onMonthSelect(month, e.target.value);
              }
            }}
          >
            {moment.months().map((label, value) => (
              <option value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="w-fit rounded border border-primary-border font-lato text-base focus:outline-none"
            value={month.year()}
            onChange={(e) => {
              onYearSelect(month, e.target.value);
            }}
          >
            {returnYears()}
          </select>
        </div>
      </div>
    );
  };

  const isInRange = (momentDate) => {
    let valid = momentDate.isBetween(min, max);

    return !valid;
    // return false;
  };

  return (
    <div className="flex  flex-col gap-[4px]">
      <label
        htmlFor={props.id || props.name}
        className="text-start font-lato text-[11px]  font-semibold leading-4 tracking-[0.2px] text-neutral-400 disabled:not-italic"
        {...field}
      >
        {label}
      </label>
      <div className="relative  ">
        <SingleDatePicker
          date={date}
          onDateChange={handleChange}
          focused={dateFocused}
          onFocusChange={({ focused }) => setDateFocused(focused)}
          id={props.id}
          placeholder={'Select'}
          renderMonthElement={renderMonthElement}
          block={true}
          noBorder={true}
          numberOfMonths={1}
          hideKeyboardShortcutsPanel={true}
          isOutsideRange={isInRange}
          disabled={props.config ? props.config.isReadOnly : false}
          isOutsideDays={isInRange}
        />
        <CalendarIcon className="absolute top-[16.25px] bottom-[15.25px] right-[13.25px]" />
      </div>
      {meta.touched && meta.error ? (
        <div className=" text-start font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};
export default FormDatePicker;
