import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

export function isDev() {
  if (!process.env['NODE_ENV'] || process.env['NODE_ENV'] === 'development') {
    return true;
  } else {
    return false;
  }
}
export const handleTextAreaHeight = (event: any, defaultHeight: string) => {
  let target = event?.target || event;
  if (target) {
    target.style.height = defaultHeight;
    target.style.height = `${target.scrollHeight}px`;
  }
  if (event) {
    const target = event.target ? (event.target as HTMLElement) : event;
    const contentHeight = target.scrollHeight;

    target.style.height = (contentHeight < defaultHeight ? contentHeight : defaultHeight) + 'px';
  }
};
export const getCookie = (cname: string) => {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);

  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};
export const getUrl = (slug: string | undefined) => {
  // @ts-ignore
  // return eval('`' + api_url + '`');

  //below code is for testing purpose
  return window.location.pathname;
  // return `/patient/patient-profile-api-v2/${slug}/`;
};

//ts-ignore
export const placeCall = (
  callUrl: string | undefined,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let url = callUrl ? callUrl : '';
  if (
    null !== window.localStorage.getItem('nice_access_token') &&
    undefined !== window.localStorage.getItem('nice_access_token')
  ) {
    let nice_access_token = window.localStorage.getItem('nice_access_token');
    let nice_session_id = window.localStorage.getItem('nice_session_id');
    url = url + '?access_token=nice_access_token&session_id=nice_session_id';
    url = url.replace('nice_access_token', nice_access_token ? nice_access_token : '');
    url = url.replace('nice_session_id', nice_session_id ? nice_session_id : '');
  }
  let response: Response;
  const FetchCall = async () => {
    setDisabled(true);
    const csrftoken: string = getCookie('csrftoken');

    response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-CSRFTOKEN': csrftoken ? csrftoken : '',
      },
      credentials: 'include',
      mode: 'cors',
    });
    if (!response.ok) {
      throw Error('Error');
    }
    const _data = await response.json();
    return _data;
  };
  // FetchCall().catch((error) => {
  //   toast.error(error);
  // });
  FetchCall()
    .then((result) => {
      try {
        if (result.provider === 'ais-th' || result.provider === 'nice') {
          let call_notes_url = result.call_notes_url;
          setDisabled(false);
          toast.success('Call Successfully Placed! A new tab will open for entering call notes ');
          window.open(call_notes_url, '_blank');
        } else {
          setDisabled(false);
          //revisit
          toast.success(result);
        }
      } catch {
        setDisabled(false);
        if (result.provider === 'nice' && response.status === 401) {
          // get_nice_access_token("placecall", PlaceCall)
        } else if (result.provider === 'nice' && response.status === 400) {
          toast.error('Phone Number is not valid.');
        } else if (result.provider === 'nice' && response.status === 403) {
          toast.error('Multi-Conference not enabled for user.');
        } else if (result.provider === 'nice' && response.status === 404) {
          toast.error(
            'Either you not logged in on NICE WIDGET or state is UNAVAILABLE. Kindly login or set state as AVAILABLE.'
          );
          window.localStorage.setItem('session_available', 'false');
        } else if (result.provider === 'nice' && response.status === 409) {
          toast.error('Multi-Conference max limit reached.');
        } else {
          // toast.error(response);
        }
      }
    })
    .catch((error) => {
      setDisabled(false);
      toast.error(error);
    });
};
export function transformToFormData(
  data: object,
  formData = new FormData(),
  parentKey: any = null
) {
  forEach(data, (value: any, key: string) => {
    if (value === null) return; // else "null" will be added

    let formattedKey = isEmpty(parentKey) ? key : `${parentKey}[${key}]`;

    if (value instanceof File) {
      formData.set(formattedKey, value);
    } else if (value instanceof Array) {
      forEach(value, (ele: string | Blob) => {
        formData.append(`${formattedKey}[]`, ele);
      });
    } else if (value instanceof Object) {
      transformToFormData(value, formData, formattedKey);
    } else {
      formData.set(formattedKey, value);
    }
  });
  return formData;
}

export function transformToDynamicFormData(
  data: object,
  formData = new FormData(),
  parentKey: any = null
) {
  let tempData = data;

  forEach(tempData, (value: any, key: string) => {
    if (value === null) return; // else "null" will be added
    if (value instanceof File) {
      formData.set(key, value);
      if (key) {
        delete tempData[key as keyof object];
      }
    }
  });

  formData.set('data', JSON.stringify(tempData));
  return formData;
}

export function transformToYupObject(data: any, parentKey: string | null = null) {
  forEach(data, (value: any, key: string) => {
    if (value === null) return; // else "null" will be added

    let formattedKey = isEmpty(parentKey) ? key : `${parentKey}[${key}]`;
    if (value instanceof Object && !value.type) {
      data[key] = transformToYupObject(value, formattedKey);
    } else {
      return value;
    }
  });

  return Yup.object().shape(data);
}

export const getEmailBody = (data: string) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(data, 'text/html');
  const text = htmlDoc?.querySelector('.body-text')?.textContent;
  return text;
};

let pythonToJsFormats: any = Object.freeze({
  '%a': 'ddd',
  '%A': 'dddd',
  '%w': 'd',
  '%d': 'DD',
  '%b': 'MMM',
  '%B': 'MMMM',
  '%m': 'MM',
  '%y': 'YY',
  '%Y': 'YYYY',
  '%H': 'HH',
  '%I': 'hh',
  '%p': 'A',
  '%M': 'mm',
  '%S': 'ss',
  '%f': 'SSS',
  '%z': 'ZZ',
  '%Z': 'z',
  '%j': 'DDDD',
  '%U': 'ww', // Week day of the year, Sunday first - not supported
  '%W': 'ww', // Week day of the year, Monday first
  '%c': 'ddd MMM DD HH:mm:ss YYYY',
  '%x': 'MM/DD/YYYY',
  '%X': 'HH:mm:ss',
  '%%': '%',
});

export function convertFormat(format: string) {
  let converted = format;
  for (let name in pythonToJsFormats) {
    if (pythonToJsFormats.hasOwnProperty(name)) {
      converted = converted?.split(name)?.join(pythonToJsFormats[name]);
    }
  }
  return converted;
}
