import { useInitialData } from 'context/InitialDataContext';
import { Formik, FormikHelpers } from 'formik';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { getCookie, getUrl, transformToDynamicFormData, transformToYupObject } from 'utils/helpers';
import { createYupSchema, renderFormElements } from '../../../components/DynamicForm/index';
// import { useSetRenderOnUpdate } from '../PatientProfileContext';
import { useParams } from 'react-router-dom';
import { EditAddressFormSchema, UpdateProfileContext } from '../index';
import ScrollToError from 'components/ScrollToError';
const handleAddressSubmit = ({
  dynamicFormData,
  setIsOpen,
  reRenderParent,
  setDisableSubmit,
  slug,
  actions,
}: {
  dynamicFormData: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDisableSubmit: Dispatch<SetStateAction<boolean>>;
  reRenderParent: any;
  slug: string | undefined;
  actions: FormikHelpers<any>;
}) => {
  const csrftoken: string = getCookie('csrftoken');

  fetch(
    // 'https://opdytat003.in.zelthy.dev/patient/patient-profile-api-v2/f98bc495-cfe1-40bd-9796-773fa1cc6b06/',
    getUrl(slug),

    {
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: dynamicFormData,
      headers: {
        'X-CSRFTOKEN': csrftoken ? csrftoken : '',
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw Error('Could Not Update Address');
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
    .catch((error) => {
      toast.error(error.message);
      setDisableSubmit(false);
      setIsOpen(true);
    });
};
export function AddressDynamicForm({
  SubmitBtnLabel,
  setIsOpen,
  addressId,
  formSchema,
}: {
  SubmitBtnLabel: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  addressId: number | undefined;
  formSchema: EditAddressFormSchema | undefined;
}) {
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const { initialData } = useInitialData();
  const { slug } = useParams();

  const initialValues2: any = {};
  let yepSchema2 = {};
  let FormSchema = formSchema ? formSchema : initialData?.address.form_schema;
  FormSchema?.forEach((eachLegend) => {
    let tempyepSchema2 = eachLegend.legendData.reduce(createYupSchema, {});
    yepSchema2 = { ...tempyepSchema2, ...yepSchema2 };
    eachLegend.legendData.forEach((item) => {
      initialValues2[item.id] = item.value;
    });
  });

  const validateSchema2 = transformToYupObject(yepSchema2);
  const UpdateProfile: any = useContext(UpdateProfileContext);

  return (
    <>
      <div className="flex w-full grow flex-col">
        <Formik
          initialValues={initialValues2}
          validationSchema={validateSchema2}
          onSubmit={(values, actions) => {
            setDisableSubmit(true);
            let dynamicFormData = transformToDynamicFormData({ ...values, id: addressId });
            dynamicFormData.append(
              'request_type',
              SubmitBtnLabel === 'Update Address' ? 'edit_data' : 'add_data'
            );
            dynamicFormData.append('data_type', 'address');
            handleAddressSubmit({
              dynamicFormData,
              setIsOpen,
              reRenderParent: UpdateProfile,
              setDisableSubmit,
              slug,

              actions,
            });

            //
          }}
        >
          {(formik) => (
            <>
              <ScrollToError />
              <form className="flex grow flex-col justify-between" onSubmit={formik.handleSubmit}>
                <div className="flex grow flex-col pl-8 pr-24 pt-2">
                  {renderFormElements(FormSchema, formik)}
                </div>
                <div className="sticky bottom-0 left-0 w-full border-t border-primary-border bg-white px-8 py-6  shadow-form-footer">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary-action  py-[11px] font-lato text-xs font-bold text-white disabled:cursor-default disabled:opacity-50  "
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

export default AddressDynamicForm;
