import { useInitialData } from 'context/InitialDataContext';
import { Form, Formik, FormikHelpers } from 'formik';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getCookie, getUrl, handleTextAreaHeight, transformToDynamicFormData } from 'utils/helpers';
import * as Yup from 'yup';
import { UpdateNotesContext } from '.';
import { ReactComponent as CloseBtn } from '../../../assests/images/CloseBtn.svg';

import { ReactComponent as FileUploadIcon } from '../../../assests/images/FileUpload.svg';
const handleNoteSubmit = ({
  dynamicFormData,
  reRenderParent,
  SetDisableSubmit,
  slug,

  actions,
}: {
  slug: string | undefined;
  reRenderParent: any;
  SetDisableSubmit: Dispatch<SetStateAction<boolean>>;
  dynamicFormData: any;

  actions: FormikHelpers<any>;
}) => {
  const csrftoken: string = getCookie('csrftoken');

  fetch(getUrl(slug), {
    method: 'POST',
    credentials: 'include',
    body: dynamicFormData,
    headers: {
      'X-CSRFTOKEN': csrftoken ? csrftoken : '',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw Error('Could Not Add Note');
      }
      return res.json();
    })
    .then(
      (res) => {
        if (res.error) {
          actions.setErrors(res.error);

          SetDisableSubmit(false);
        } else {
          reRenderParent.toggleRenderOnUpdate();
          toast.success(res.message);
        }
      },
      (error) => {
        toast.error(error.message);
      }
    )
    .catch((err) => {
      toast.error(err.message);
    });
};
export const AddNotesForm = () => {
  const { slug } = useParams();
  const { initialData } = useInitialData();
  const UpdateNotes: any = useContext(UpdateNotesContext);

  const [showUpload, setShowUpload] = useState<boolean>();
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>();

  const initialValues = {
    body: '',
    'notes-file': '',
  };

  const validationSchema = Yup.object({
    body: Yup.string().required('Please enter a note'),
    'notes-file': Yup.mixed()
      .test(
        'fileFormat',
        'Unsupported file type',
        (value) =>
          value === null ||
          value === undefined ||
          (value &&
            ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'].includes(value.type))
      )
      .test(
        'fileSize',
        'File size should not exceed 5MB',

        (value) => value === null || value === undefined || (value && value.size <= 5242880)
      ),
  });

  return (
    <>
      {initialData?.notes?.allow_create && (
        <div className=" w-full rounded border border-primary-border ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              setDisableSubmit(true);
              if (values['notes-file'] === null) {
                delete values['notes-file' as keyof object];
              }
              let dynamicFormData = transformToDynamicFormData(values);
              dynamicFormData.append('request_type', 'add_data');
              dynamicFormData.append('data_type', 'note');
              handleNoteSubmit({
                dynamicFormData,
                reRenderParent: UpdateNotes,
                SetDisableSubmit: setDisableSubmit,
                slug,

                actions,
              });
            }}
          >
            {(formProps) => (
              <Form>
                <textarea
                  id="body"
                  name="body"
                  placeholder="Take a note ..."
                  className=" block  h-12 w-full resize-none border-secondary bg-secondary px-4 pt-[14px]  text-sm outline-none focus:outline-none "
                  onClick={() => {
                    setShowUpload(true);
                  }}
                  onChange={formProps.handleChange('body')}
                  onChangeCapture={(event) => handleTextAreaHeight(event, '48px')}
                  disabled={!initialData?.notes?.allow_create}
                ></textarea>
                {formProps.errors.body && formProps.touched.body ? (
                  <div className="bg-secondary px-4 font-lato text-xs text-red-400">
                    {formProps.errors.body}
                  </div>
                ) : null}
                <div
                  className={` w-full flex-col gap-1 bg-secondary pt-[14px] pl-4 pr-2 pb-2 ${
                    showUpload ? 'flex' : 'hidden'
                  } `}
                >
                  {/* <UploadFile /> */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label htmlFor="notes-file" className="cursor-pointer">
                        <FileUploadIcon className="text-[#6D6D6D]" />
                      </label>
                      {fileName ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex  gap-1 pl-1">
                            <p className="w-20 truncate font-lato text-xs text-tertiary">
                              {fileName && fileName}
                            </p>
                            <CloseBtn
                              className="mt-[6px] flex h-[6px] w-[6px] cursor-pointer"
                              onClick={() => {
                                setFileName('');
                                formProps.setFieldValue('notes-file', null);
                              }}
                            />
                          </div>
                        </div>
                      ) : null}
                      <input
                        type="file"
                        multiple={false}
                        id="notes-file"
                        name="notes-file"
                        className="hidden h-0 w-0"
                        onChange={(e) => {
                          setFileName(e.target?.files?.[0].name);
                          formProps.setFieldValue('notes-file', e.target.files?.[0]);

                          // handleFileValidaitons(e.target?.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </div>
                    {/* Upload File End */}
                    <button
                      className="h-fit w-fit cursor-pointer rounded bg-primary-action py-[7px] px-4 font-lato text-xs font-medium tracking-[0.2px] text-white disabled:cursor-default disabled:opacity-50"
                      type="submit"
                      disabled={disableSubmit || formProps.values['body'] === ''}
                    >
                      Save
                    </button>
                  </div>
                  {formProps.errors['notes-file'] && formProps.touched['notes-file'] ? (
                    <div className="bg-secondary font-lato text-xs text-red-400">
                      {formProps.errors['notes-file']}
                    </div>
                  ) : null}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
