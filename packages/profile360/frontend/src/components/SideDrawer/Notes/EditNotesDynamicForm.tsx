import { useInitialData } from 'context/InitialDataContext';
import { Formik, FormikHelpers } from 'formik';
import toast from 'react-hot-toast';

import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl, transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import { createYupSchema, renderFormElements } from '../../DynamicForm/index';
import { EditNotesFormSchema, UpdateNotesContext } from './index';
import ScrollToError from 'components/ScrollToError';

const handleNoteSubmit = ({
  setIsOpen,
  dynamicFormData,
  reRenderParent,
  setDisabledSubmit,
  slug,

  actions,
}: {
  slug: string | undefined;
  reRenderParent: any;
  dynamicFormData: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDisabledSubmit: Dispatch<SetStateAction<boolean>>;
  actions: FormikHelpers<any>;
}) => {
  const csrftoken: string = getCookie('csrftoken');

  fetch(getUrl(slug), {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: dynamicFormData,
    headers: {
      'X-CSRFTOKEN': csrftoken ? csrftoken : '',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw Error('Could Not Update Note');
      }
      return res.json();
    })
    .then(
      (res) => {
        if (res.error) {
          actions.setErrors(res.error);
          setDisabledSubmit(false);
        } else {
          reRenderParent.toggleRenderOnUpdate();

          setIsOpen(false);
          toast.success(res.message);
        }
      },
      (error) => {
        toast.error(error.message);
        setDisabledSubmit(false);
      }
    )
    .catch((err) => {
      toast.error(err.message);

      setIsOpen(true);
      setDisabledSubmit(false);
    });
};
export function EditNotesDynamicForm({
  SubmitBtnLabel,
  notesId,
  setIsOpen,
  formSchema,
}: {
  SubmitBtnLabel: string;
  notesId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  formSchema: EditNotesFormSchema;
}) {
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
  const { slug } = useParams();

  const initialValues: any = {};
  let yepSchema = {};
  formSchema.forEach((eachLegend) => {
    let tempyepSchema = eachLegend.legendData.reduce(createYupSchema, {});
    yepSchema = { ...tempyepSchema, ...yepSchema };
    //
    eachLegend.legendData.forEach((item) => {
      item.id === 'edit-notes-file'
        ? (initialValues[item.id] = null)
        : (initialValues[item.id] = item.value);
    });
  });
  initialValues['is_deleted'] = false;

  const validateSchema = transformToYupObject(yepSchema);
  //
  const UpdateNotes: any = useContext(UpdateNotesContext);

  return (
    <>
      <div className=" flex w-full grow flex-col">
        <Formik
          initialValues={initialValues}
          validationSchema={validateSchema}
          onSubmit={(values, actions) => {
            setDisabledSubmit(true);
            let dynamicFormData = transformToDynamicFormData({
              ...values,
              id: notesId,
            });

            dynamicFormData.append('request_type', 'edit_data');
            dynamicFormData.append('data_type', 'note');

            handleNoteSubmit({
              setIsOpen,
              dynamicFormData,
              reRenderParent: UpdateNotes,
              setDisabledSubmit,
              slug,

              actions,
            });
          }}
        >
          {(formik) => (
            <>
              <ScrollToError />
              <form className="flex grow flex-col justify-between" onSubmit={formik.handleSubmit}>
                <div className="flex grow  flex-col pl-8 pr-24 pt-2 ">
                  {renderFormElements(formSchema, formik)}
                </div>
                <div className="sticky bottom-0 left-0 w-full border-t border-primary-border bg-white px-8 py-6 shadow-form-footer">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-action py-[11px] font-lato text-xs font-bold text-white disabled:cursor-default disabled:opacity-50  "
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

export default EditNotesDynamicForm;
