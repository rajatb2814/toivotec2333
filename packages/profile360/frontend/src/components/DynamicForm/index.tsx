import { Formik, FormikProps } from 'formik';
import { get, setWith } from 'lodash';
import { transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import * as Yup from 'yup';
import CheckboxField from './components/CheckboxField';
import FormDatePicker from './components/DatePicker';
import FileUpload from './components/FileUpload';
import MultiSelectField from './components/MultiSelect';
import MultiSelect2 from './components/MultiSelect2';
import SelectField from './components/SelectField';
import TextArea from './components/TextArea';
import TextField from './components/TextField';
import ToggleField from './components/ToggleField';
import { formData, formData2 } from './formData';
// import DatePicker from './components/DatePicker';

export function createYupSchema(schema: any, config: any) {
  let { componentName, id, validationType, validations = [], isNullable } = config;
  // @ts-ignore
  if (!Yup[validationType]) {
    return schema;
  }

  if (componentName === 'MultiSelectField') {
    validationType = 'array';
  }
  // @ts-ignore
  let validator = Yup[validationType]();

  if (isNullable) {
    // @ts-ignore
    validator = Yup[validationType]().nullable();
  }
  validations.forEach((validation: { params: any; type: any }) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }

    if (type === 'test') {
      if (typeof params[2] === 'string') {
        let temp = params[2];
        params.pop();
        params.push(eval(temp));
      }
    }
    if (componentName === 'DatePicker') {
      validator = validator[type](...params);
    } else {
      validator = validator[type](...params);
    }
    if (validationType === 'boolean') {
      if (type === 'required') {
        validator = Yup.bool().oneOf([true], ...params);
      }
    }
  });

  let idList = id.split('.');

  schema = setWith(schema, idList, validator, Object);

  return schema;
}

export const renderElements = (elementData: any[], formik: FormikProps<any>) =>
  elementData.map((item, index) => {
    const fieldMap: any = {
      TextArea: TextArea,
      TextField: TextField,
      FileUpload: FileUpload,
      SelectField: SelectField,
      // MultiSelectField: MultiSelectField,
      MultiSelectField: MultiSelect2,

      // SelectField: DatePickers,
      // DatePicker: DatePickers,
      DatePicker: FormDatePicker,
      CheckboxField: CheckboxField,
      ToggleField: ToggleField,
    };
    const Component = fieldMap[item.componentName];
    let error = formik.errors.hasOwnProperty(item.id) && formik.errors[item.id];

    if (item.type) {
      switch (item.type) {
        case 'file':
          return (
            <Component
              key={index}
              type="file"
              label={item.label}
              name={item.id}
              id={item.id}
              placeholder={item.placeholder}
              // file={item.vlaue === undefined ? '' : item.value}
              displayfile={item.value === null ? '' : item.value}
              value={null}
              filename={get(formik.values, `${item.id}.name`, '')}
              onChange={(event: any) => {
                if (event.currentTarget.files) {
                  formik.setFieldValue(item.id, event.currentTarget.files[0]);
                  event.currentTarget.value = null;
                }
              }}
              error={error?.toString()}
              formik={formik}
            />
          );
          break;
        case 'select':
          return (
            <Component
              key={index}
              label={item.label}
              name={item.id}
              id={item.id}
              placeholder={item.placeholder}
              value={get(formik.values, item.id, '')}
              optionsData={item.optionsData}
              onChange={formik.handleChange}
              error={error?.toString()}
              formik={formik}
              config={item?.config}
            />
          );
          break;
        // case 'checkbox':
        //   return (
        //     <Component
        //       key={index}
        //       label={item.label}
        //       name={item.id}
        //       id={item.id}
        //       placeholder={item.placeholder}
        //       value={get(formik.values, item.id, false)}
        //       onChange={(event: any) => {
        //         formik.setFieldValue(item.id, event.target.checked);
        //       }}
        //       error={error?.toString()}
        //       formik={formik}
        //       config={item.config}
        //       // type={item.type}
        //     />
        //   );
        //   break;
        default:
          return (
            <Component
              key={index}
              label={item.label}
              name={item.id}
              id={item.id}
              placeholder={item.placeholder}
              value={get(formik.values, item.id, '')}
              onChange={formik.handleChange}
              error={error?.toString()}
              formik={formik}
              config={item.config}
              // type={item.type}
            />
          );
      }
    }
    return '';
  });

export const renderFormElements = (formData2: any[] | undefined, formik: FormikProps<any>) =>
  formData2?.map((eachData, index) => {
    return (
      <fieldset className="invisible-scrollbar mb-[32px] grow overflow-auto" key={index}>
        {/* {eachData.legend && (
          <legend className="w-full pb-2 text-start font-lato text-xs tracking-[0.2px] text-tertiary">
            {eachData.legend}
          </legend>
        )} */}
        <div className="flex flex-col gap-4">{renderElements(eachData.legendData, formik)}</div>
      </fieldset>
    );
  });

export function DynamicForm({ SubmitBtnLabel }: { SubmitBtnLabel: string }) {
  const initialValues: any = {};
  formData.forEach((item) => {
    initialValues[item.id] = item.value || '';
  });

  const yepSchema = formData.reduce(createYupSchema, {});

  const validateSchema = transformToYupObject(yepSchema);

  //Form 2
  const initialValues2: any = {};
  let yepSchema2 = {};
  formData2.forEach((eachLegend) => {
    let tempyepSchema2 = eachLegend.legendData.reduce(createYupSchema, {});
    yepSchema2 = { ...tempyepSchema2, ...yepSchema2 };

    eachLegend.legendData.forEach((item) => {
      initialValues2[item.id] = item.value || '';
    });
  });

  //
  const validateSchema2 = transformToYupObject(yepSchema2);

  return (
    <>
      {/* <div className="form">
        <h1>Form here</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validateSchema}
          onSubmit={(values, actions) => {
            
            
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              {renderElements(formData, formik)}
              <button type="submit">Submit</button>
            </form>
          )}
        </Formik>
      </div> */}

      <div className="form w-full">
        <Formik
          initialValues={initialValues2}
          validationSchema={validateSchema2}
          onSubmit={(values, actions) => {
            //
            //
            let dynamicFormData = transformToDynamicFormData(values);
            //
            for (const pair of dynamicFormData.entries()) {
              //
            }
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              {renderFormElements(formData2, formik)}
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary-action py-[9px] font-lato text-xs font-bold text-white  "
              >
                {SubmitBtnLabel}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default DynamicForm;
