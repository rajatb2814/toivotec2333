import { useInitialData } from 'context/InitialDataContext';
import { Formik, FormikHelpers } from 'formik';
import toast from 'react-hot-toast';

import { UpdateAppContext } from 'Pages/Dashboard';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl, transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import { createYupSchema, renderFormElements } from '../../../components/DynamicForm/index';
import ScrollToError from 'components/ScrollToError';
const handleEditStatusSubmit = ({
  setIsOpen,
  dynamicFormData,
  setDisabledSubmit,
  reRenderParent,
  slug,
  actions,
}: {
  dynamicFormData: any;
  reRenderParent: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDisabledSubmit: Dispatch<SetStateAction<boolean>>;
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
      //
      if (!res.ok) {
        //
        throw Error('Could Not Update');
      }
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        actions.setErrors(res.error);

        setDisabledSubmit(false);
      } else {
        reRenderParent.toggleRenderOnUpdate();

        setIsOpen(false);
        toast.success(res.message);
      }
    })
    .catch((err) => {
      setIsOpen(true);
      setDisabledSubmit(false);
      toast.error(err.message);
    });
};
export function EditStatusDynamicForm({
  SubmitBtnLabel,
  statusId,
  setIsOpen,
}: {
  SubmitBtnLabel: string;
  statusId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const { initialData } = useInitialData();
  const { slug } = useParams();

  const initialValues2: any = {};
  let yepSchema2 = {};
  initialData?.object_status.form_schema.forEach((eachLegend) => {
    let tempyepSchema2 = eachLegend.legendData.reduce(createYupSchema, {});
    yepSchema2 = { ...tempyepSchema2, ...yepSchema2 };
    eachLegend.legendData.forEach((item) => {
      initialValues2[item.id] = item.value;
    });
  });

  const validateSchema2 = transformToYupObject(yepSchema2);
  const UpdateApp: any = useContext(UpdateAppContext);
  return (
    <>
      <div className="relative flex w-full grow flex-col">
        <Formik
          initialValues={initialValues2}
          validationSchema={validateSchema2}
          onSubmit={(values, actions) => {
            setDisabledSubmit(true);
            let dynamicFormData = transformToDynamicFormData({
              ...values,
              status: statusId,
            });
            dynamicFormData.append('request_type', 'add_data');
            dynamicFormData.append('data_type', 'status');
            //
            // dynamicFormData.append(
            // 'data',
            // JSON.stringify({ toggled_state: toggled_state, tag: tagId })
            // );
            handleEditStatusSubmit({
              setIsOpen,
              dynamicFormData,
              setDisabledSubmit,
              reRenderParent: UpdateApp,
              slug,

              actions,
            });
          }}
        >
          {(formik) => (
            <>
              <ScrollToError />
              <form onSubmit={formik.handleSubmit} className=" flex grow flex-col justify-between ">
                <div className="flex  grow flex-col pl-8 pr-24  pt-2 ">
                  {renderFormElements(initialData?.object_status.form_schema, formik)}
                </div>
                <div className="sticky bottom-0 left-0 w-full border-t border-primary-border bg-white px-8 py-6  shadow-form-footer">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-action py-[11px] font-lato text-xs font-bold text-white disabled:cursor-default disabled:opacity-50"
                    disabled={disabledSubmit || !formik.dirty}
                  >
                    {disabledSubmit ? 'Loading...' : SubmitBtnLabel}
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

export default EditStatusDynamicForm;
