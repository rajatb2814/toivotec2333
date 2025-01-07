import { useInitialData } from 'context/InitialDataContext';
import { Formik, FormikHelpers } from 'formik';
import { UpdateAppContext } from 'Pages/Dashboard';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl, transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import { createYupSchema, renderFormElements } from '../../../components/DynamicForm/index';
import ScrollToError from 'components/ScrollToError';
const handleTagSubmit = ({
  tagId,
  toggled_state,
  note,
  setIsOpen,
  dynamicFormData,
  setDisableSubmit,
  reRenderParent,
  slug,
  actions,
}: {
  dynamicFormData: any;
  tagId: number;
  toggled_state: string;
  note: string;
  reRenderParent: any;
  slug: string | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDisableSubmit: Dispatch<SetStateAction<boolean>>;
  actions: FormikHelpers<any>;
}) => {
  const csrftoken: string = getCookie('csrftoken');

  fetch(getUrl(slug), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFTOKEN': csrftoken ? csrftoken : '',
    },
    body: dynamicFormData,
  })
    .then((res) => {
      //
      if (!res.ok) {
        throw Error('Could Not Update Tag');
      }
      return res.json();
    })
    .then((res) => {
      if (res.error) {
        actions.setErrors(res.error);

        setDisableSubmit(false);
      } else {
        reRenderParent.toggleRenderOnUpdate();

        setIsOpen(false);
        toast.success(res.message);
      }
    })
    .catch((err) => {
      toast.error(err.message);
      setDisableSubmit(false);
      setIsOpen(true);
    });
};
export function TagsDynamicForm({
  SubmitBtnLabel,
  tagId,
  toggled_state,
  setIsOpen,
}: {
  SubmitBtnLabel: string;
  tagId: number;
  toggled_state: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const UpdateProfile: any = useContext(UpdateAppContext);

  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const { initialData } = useInitialData();
  const { slug } = useParams();
  const initialValues2: any = {};
  let yepSchema2 = {};
  initialData?.tags.form_schema.forEach((eachLegend) => {
    let tempyepSchema2 = eachLegend.legendData.reduce(createYupSchema, {});
    yepSchema2 = { ...tempyepSchema2, ...yepSchema2 };
    eachLegend.legendData.forEach((item) => {
      initialValues2[item.id] = item.value;
    });
  });

  const validateSchema2 = transformToYupObject(yepSchema2);

  return (
    <>
      <div className="flex w-full grow flex-col">
        <Formik
          initialValues={initialValues2}
          validationSchema={validateSchema2}
          onSubmit={(values, actions) => {
            setDisableSubmit(true);

            let dynamicFormData = transformToDynamicFormData({
              ...values,
              toggled_state: toggled_state,
              tag: tagId,
            });

            dynamicFormData.append('request_type', 'add_data');
            dynamicFormData.append('data_type', 'tag');
            //

            handleTagSubmit({
              tagId,
              toggled_state,
              note: values.note,
              setIsOpen,
              dynamicFormData,
              setDisableSubmit,
              reRenderParent: UpdateProfile,
              slug,
              actions,
            });
          }}
        >
          {(formik) => (
            <>
              <ScrollToError />
              <form className="flex grow flex-col justify-between" onSubmit={formik.handleSubmit}>
                <div className="flex grow flex-col pl-8  pr-24 pt-2">
                  {renderFormElements(initialData?.tags.form_schema, formik)}
                </div>
                <div className="sticky bottom-0 left-0 w-full border-t border-primary-border bg-white px-8 py-6  shadow-form-footer">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-action py-[11px] font-lato text-xs font-bold text-white disabled:cursor-default disabled:opacity-50  "
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

export default TagsDynamicForm;
