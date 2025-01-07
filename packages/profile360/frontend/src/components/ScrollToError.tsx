import { useFormikContext } from 'formik';
import { useEffect } from 'react';

const ScrollToError = () => {
  const formik = useFormikContext();
  useEffect(() => {
    const first_error_element = Object.keys(formik.errors)[0];
    document
      .getElementById(first_error_element)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [formik.errors]);
  return null;
};

export default ScrollToError;
