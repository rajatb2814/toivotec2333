import { useField } from 'formik';
import { useEffect, useState } from 'react';
import { ReactComponent as DeletFileIcon } from '../../../assests/images/delete-icon.svg';
import { ReactComponent as FileUploadIcon } from '../../../assests/images/FileUpload.svg';
import { ReactComponent as UploadFileIcon } from '../../../assests/images/UploadFileIcon.svg';
// import { ReactComponent as CrossIcon } from '../../../assests/images/CloseBtn.svg';

export const FileUpload = ({ formik, label, value, ...props }: any) => {
  const [field, meta] = useField(props);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[14.48px]">
        <div className="flex flex-col items-start gap-1">
          <label
            htmlFor={props.id || props.name}
            className="text-start font-lato text-[11px] font-semibold leading-4 tracking-[0.2px] text-neutral-400"
          >
            {label}
          </label>
          <div className="relative w-full">
            <label
              htmlFor={props.id || props.name}
              className={`  flex w-full cursor-pointer items-start justify-between rounded-md  border bg-white   px-4 pt-4 pb-[13px] font-lato text-sm  text-neutral-700 ${
                props.filename ? 'text-neutral-700' : 'text-neutral-400'
              }  ${
                meta.touched && meta.error
                  ? 'border-dashed border-red-500'
                  : 'border-dashed border-primary-border'
              }`}
            >
              {/* {props.filename ? props.filename : props.placeholder} */}
              {props.filename ? (
                <>
                  <div className=" w-80  truncate text-start">{props.filename}</div>
                </>
              ) : (
                'Click to Upload'
              )}
            </label>
            {props.filename ? (
              <DeletFileIcon
                onClick={() => {
                  formik.setFieldValue(props.id, null);
                  formik.setFieldValue('is_deleted', false);
                }}
                className="absolute right-4 top-4"
              />
            ) : (
              <UploadFileIcon className="absolute right-4 top-4" />
            )}
          </div>
          <input
            className=" hidden w-full rounded-md border bg-white  font-lato text-sm text-tertiary"
            {...field}
            {...props}
            value={null}
            onChangeCapture={() => formik.setFieldValue('is_deleted', true)}
            disabled={props?.config ? props?.config?.isReadOnly : false}
          />
        </div>

        {/* display and delete previously uploaded file */}
        {props.displayfile && !isDeleted ? (
          // <div className="flex flex-col">
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-[10px]">
              <FileUploadIcon className="text-primary-action" fill="text-primary-action" />
              <a
                href={props.displayfile}
                target={'blank'}
                className="cursor-pointer  font-lato text-sm font-bold  tracking-[0.2px] !text-primary-action"
              >
                Document
              </a>
            </div>
            <input
              type="checkbox"
              name="is_deleted"
              id="is_deleted"
              className="hidden h-0 w-0 cursor-pointer"
              onClick={() => {
                setIsDeleted(true);
                formik.setFieldValue('is_deleted', true);
              }}
            ></input>
            <label htmlFor="is_deleted" className={`flex cursor-pointer items-center pl-2`}>
              <DeletFileIcon />
            </label>
          </div>
        ) : null}
      </div>
      {meta.touched && meta.error ? (
        <div className="error text-start font-lato text-xs text-red-400">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FileUpload;
