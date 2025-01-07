import { Formik, FormikHelpers, useFormikContext } from 'formik';
import toast from 'react-hot-toast';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl, transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import { createYupSchema, renderFormElements } from '../../../components/DynamicForm/index';
import { EditProifleFormSchema, UpdateProfileContext } from '../index';
import ScrollToError from 'components/ScrollToError';

const handleEditProifleSubmit = ({
  setIsOpen,
  dynamicFormData,
  reRenderParent,
  SetDisableSubmit,
  slug,
  actions,
}: {
  dynamicFormData: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  reRenderParent: any;
  SetDisableSubmit: Dispatch<SetStateAction<boolean>>;
  slug: string | undefined;
  actions: FormikHelpers<any>;
}) => {
  const csrftoken: string = getCookie('csrftoken');

  fetch(getUrl(slug), {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    headers: {
      'X-CSRFTOKEN': csrftoken ? csrftoken : '',
    },
    body: dynamicFormData,
  })
    .then((res) => {
      if (!res.ok) {
        throw Error('Could Not Update Profile');
      }
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        actions.setErrors(res.error);

        SetDisableSubmit(false);
      } else {
        reRenderParent.toggleRenderOnUpdate();

        setIsOpen(false);
        toast.success(res.message);
      }
    })
    .catch((err) => {
      setIsOpen(true);
      //
      toast.error(err.message);
      SetDisableSubmit(false);
    });
};
export function EditProfileDynamicForm({
  SubmitBtnLabel,
  setIsOpen,
  formSchema,
}: {
  SubmitBtnLabel: string;
  formSchema: EditProifleFormSchema | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const { slug } = useParams();
  const initialValues: any = {};
  let yepSchema = {};

  formSchema?.forEach((eachLegend) => {
    eachLegend.legendData.forEach((component: any, key: any) => {});
    let tempyepSchema = eachLegend.legendData.reduce(createYupSchema, {});

    yepSchema = { ...tempyepSchema, ...yepSchema };

    eachLegend.legendData.forEach((item) => {
      if (item.isNullable) {
        initialValues[item.id] = item.value || null;
      } else {
        initialValues[item.id] = item.value;
      }
    });
  });
  const validateSchema = transformToYupObject(yepSchema);
  const UpdateProfile: any = useContext(UpdateProfileContext);

  return (
    <>
      <div className="relative flex w-full grow flex-col">
        <Formik
          initialValues={initialValues}
          validationSchema={validateSchema}
          onSubmit={(values, actions) => {
            setDisableSubmit(true);
            let dynamicFormData = transformToDynamicFormData({
              ...values,
            });
            dynamicFormData.append('request_type', 'edit_data');
            dynamicFormData.append('data_type', 'patient');
            handleEditProifleSubmit({
              setIsOpen,
              dynamicFormData,
              reRenderParent: UpdateProfile,
              SetDisableSubmit: setDisableSubmit,
              slug,
              actions,
            });
          }}
        >
          {(formik) => (
            <>
              <ScrollToError />
              <form onSubmit={formik.handleSubmit} className=" flex grow flex-col justify-between ">
                <div className="flex  flex-col pl-8 pr-24  pt-2 ">
                  {renderFormElements(formSchema, formik)}
                </div>
                <div className="sticky bottom-0 left-0 w-full border-t border-primary-border bg-white px-8 py-6 shadow-form-footer ">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-action py-[11px] font-lato text-xs font-bold text-white disabled:cursor-default disabled:opacity-50"
                    disabled={disableSubmit || !formik.dirty}
                  >
                    {disableSubmit ? 'Loading...' : SubmitBtnLabel}
                  </button>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

export default EditProfileDynamicForm;
