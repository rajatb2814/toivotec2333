import DefaultLoader from 'components/Loaders/DefaultLoader';
import { useInitialDataDispatch } from 'context/InitialDataContext';
import useApi from 'hooks/useApi';
import Dashboard from 'Pages/Dashboard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUrl } from 'utils/helpers';
import DismissableToast from '../components/CustomToast';
import { getCookie } from 'utils/helpers';
import { convertFormat } from 'utils/helpers';
function App() {
  const { slug } = useParams();
  const initialDataDispatch = useInitialDataDispatch();
  const [error, setError] = useState<Error>();
  const [isLoaded, setIsLoaded] = useState(false);

  let response: Response;
  const triggerApi = useApi();

  const FetchConfig = async () => {
    const csrftoken: string = getCookie('csrftoken');

    console.log(csrftoken);

    response = await fetch(getUrl(slug), {
      method: 'POST',
      headers: {
        'X-CSRFTOKEN': csrftoken ? csrftoken : '',
        'Content-Type': 'application/json',
      },
      mode: 'cors',

      credentials: 'include',
      body: JSON.stringify({
        request_type: 'config',
      }),
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const config = await response.json();
    return config;
  };
  useEffect(() => {
    FetchConfig().then(
      (result) => {
        result['app_config']['datetime_format'] = convertFormat(
          result?.app_config?.datetime_format
        );
        result['app_config']['date_format'] = convertFormat(result?.app_config?.date_format);
        initialDataDispatch({
          type: 'SET_DATA',
          payload: result,
        });
        setIsLoaded(true);
      },
      (error) => {
        // typeof error;
        setError(error);
      }
    );
    // const makeApiCall = async () => {
    //   const { response, success } = await triggerApi({
    //     url: getUrl(slug, isCustomUrl),
    //     type: 'POST',
    //     payload: {
    //       request_type: 'config',
    //     },
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include',
    //     loader: true,
    //   });

    //   // if (success && response) {
    //   //   setProgramsData(response);
    //   // }
    //   if (response) {
    //     initialDataDispatch({
    //       type: 'SET_DATA',
    //       payload: response,
    //     });
    //   }
    // };
    // makeApiCall();
  }, []);

  if (error) {
    return <div dangerouslySetInnerHTML={{ __html: error.message }}></div>;
  } else if (!isLoaded) {
    return <DefaultLoader showSpinner={true} />;
  } else {
    return (
      <>
        <DismissableToast />
        <Dashboard />
      </>
    );
  }
}

export default App;
