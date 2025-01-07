import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getEmailBody } from 'utils/helpers';
import { getCookie } from 'utils/helpers';
import { ReactComponent as AeIcon } from '../../../assests/images/AeIcon.svg';
import { ReactComponent as CallIcon } from '../../../assests/images/CallIcon.svg';
import { ReactComponent as FileIcon } from '../../../assests/images/FileUpload.svg';
import { ReactComponent as MailIcon } from '../../../assests/images/MailIcon.svg';
import { ReactComponent as SMSIcon } from '../../../assests/images/SMSIcon.svg';
import { ReactComponent as StatusIcon } from '../../../assests/images/StatusIcon.svg';
import { ReactComponent as TagsIcon } from '../../../assests/images/TagsIcon.svg';
import { useParams } from 'react-router-dom';
import { getUrl } from 'utils/helpers';
import { useInitialData } from 'context/InitialDataContext';
// export type  = Root;
export interface timelineInfoInterface {
  total_pages: number;
  page_number: number;
  page_length: number;
  total_objects: number;
  data: Data[];
  counts: counts;
}
export interface counts {
  'Adverse Events': number;
  Calls: number;
  Email: number;
  SMS: number;
  Status: number;
  Tags: number;
}
export interface Data {
  date: string;
  content: Content[];
}
export type timelineDataInterface = Data;

export interface Content {
  status?: string;
  label: string;
  obj_url?: string;
  created_date: string;
  type: string;
  id: any;
  note?: string;
  toggled_state?: string;
  file?: string;
  created_by?: string;
  body_type: string;
  email_type?: string;
}

export const Timeline = ({
  filtersArr,
  setFilterCount,
}: {
  filtersArr: string[];
  setFilterCount: Dispatch<SetStateAction<counts | undefined>>;
}) => {
  const [timeLineData, setTimeLineData] = useState<timelineDataInterface[]>([]);
  const [timeLineInfo, setTimeLineInfo] = useState<timelineInfoInterface>();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const abortController = useRef<AbortController>();
  const componentDidMount = useRef(false);
  const { slug } = useParams();
  const pageLength = 10; //number of content per page
  let response: Response;
  const { initialData } = useInitialData();
  let dateTimeFormat = initialData?.app_config?.datetime_format;
  let dateFormat = initialData?.app_config?.date_format;

  const FetchPrograms = async (pageNumber: number, signal: AbortSignal | undefined) => {
    const csrftoken: string = getCookie('csrftoken');

    response = await fetch(getUrl(slug), {
      method: 'POST',
      headers: {
        'X-CSRFTOKEN': csrftoken ? csrftoken : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal: signal ? signal : null,
      body: JSON.stringify(
        filtersArr.length === 0
          ? {
              request_type: 'data',
              data_type: 'timeline_view_data',
              page_number: pageNumber,
              page_length: pageLength,
            }
          : {
              request_type: 'data',
              data_type: 'timeline_view_data',
              page_number: pageNumber,
              page_length: pageLength,
              filters: filtersArr,
            }
      ),
    });
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    return result;
  };

  const getTimelineData = (forPagination: boolean, signal: AbortSignal | undefined) => {
    if (!forPagination) {
      setIsLoaded(false);
    }
    //
    let pageNumber = Math.ceil(renderedPageLength() / pageLength) + 1;

    FetchPrograms(pageNumber, signal).then(
      (data) => {
        // start Merging Already Loaded Data and newly Fetched Data (for inifinite Scroll)
        setFilterCount(data.counts);
        let mergeData: Data[] = [];
        if (timeLineData.length <= 0) {
          if (data.data.length !== 0) {
            mergeData = [...data.data];
            setTimeLineData(mergeData);
          }
        } else {
          for (let currData = 0; currData < timeLineData.length; currData++) {
            for (let nextData = 0; nextData < data.data.length; nextData++) {
              if (timeLineData[currData].date === data.data[nextData].date) {
                timeLineData[currData].content = [
                  ...timeLineData[currData].content,
                  ...data.data[nextData].content,
                ];
                if (nextData === 0) {
                  data.data.shift();
                } else {
                  data.data.splice(nextData, nextData);
                }
              }
            }
          }
          mergeData = [...timeLineData, ...data.data];
          setTimeLineData(mergeData);
        }
        // end Merging Already Loaded Data and newly Fetched Data (for inifinite Scroll)
        setTimeLineInfo(data);
        setIsLoaded(true);
      },
      (error) => {
        // setError(error);
        setIsLoaded(false);
      }
    );
  };

  useEffect(() => {
    setTimeLineData([]);
  }, [filtersArr]);

  useEffect(() => {
    if (componentDidMount.current && timeLineData.length === 0) {
      abortController.current && abortController.current?.abort();

      abortController.current = new AbortController();
      const { signal } = abortController.current;
      getTimelineData(false, signal);
    } else {
      componentDidMount.current = true;
    }
  }, [timeLineData, abortController]);

  const fetchMoreData = () => {
    getTimelineData(true, undefined);
  };

  const renderedPageLength = () => {
    let length = 0;

    timeLineData?.forEach((content, id) => {
      length = length + content?.content.length;
    });
    return length;
  };

  const Icons = {
    SMS: <SMSIcon />,
    Email: <MailIcon />,
    Status: <StatusIcon />,
    Call: <CallIcon />,
    Tags: <TagsIcon />,
    'Adverse Events': <AeIcon />,
  };
  if (error) {
    return (
      <div
        className="absolute inset-0 z-[100] bg-[#161623]"
        dangerouslySetInnerHTML={{ __html: error.message }}
      ></div>
    );
  } else if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="inline-block transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle md:w-96">
          <div className="flex w-full flex-col items-center rounded-[6px]">
            <div className="overlay-spinner" />
          </div>
        </div>{' '}
      </div>
    );
  } else {
    return (
      <div
        className={`   custom-scrollbar relative  h-[100px] flex-grow overflow-auto px-6 py-8`}
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={renderedPageLength()}
          next={fetchMoreData}
          hasMore={renderedPageLength() < (timeLineInfo ? timeLineInfo.total_objects : 0)}
          loader={
            <div>
              <div className="inline-block  w-full transform overflow-hidden rounded-[6px] bg-transparent py-4 text-left align-bottom transition-all  ">
                <div className="flex w-full flex-col items-start rounded-[6px] pl-20">
                  <div className="overlay-spinner !h-8 !w-8" />
                </div>
              </div>
            </div>
          }
          scrollableTarget="scrollableDiv"
          scrollThreshold={1}
          className=" !overflow-hidden"
        >
          {timeLineData &&
            timeLineData?.map((timeline_date, key) => {
              return (
                <div
                  key={key}
                  className="  flex min-w-[40px]  flex-col last:[&>*]:last:[&>*]:last:pb-0"
                >
                  {/* */}
                  <div
                    className={`flex w-[193.7px] flex-col items-center justify-center only:hidden`}
                  >
                    <div className=" w-fit rounded bg-primary-border px-2 py-1 font-lato text-xs font-bold tracking-[0.2px]">
                      {moment(timeline_date.date, dateFormat).format('Do MMMM YYYY')}
                    </div>
                    <hr className=" h-6 w-[0.1px] border-r border-dotted border-secondary-label"></hr>
                  </div>

                  {/* timeline child item */}
                  {timeline_date.content &&
                    timeline_date.content.map((timeline_content, key) => {
                      // if (filtersArr.includes(timeline_content?.type) || filtersArr.length === 0) {
                      return (
                        <div
                          key={key}
                          className="relative flex h-full min-h-[34px] items-start pl-[16px] "
                        >
                          <div className=" w-[65.5px] pt-2  font-lato text-xs font-normal tracking-[0.2px] text-tertiary">
                          {timeline_content.created_date
                            ? moment(timeline_content.created_date, dateTimeFormat).format('hh:mm A')
                          : ''}
                          </div>
                          <div className="absolute left-[80.5px]">
                            {timeline_content?.type &&
                              Icons[timeline_content?.type as keyof typeof Icons]}
                          </div>
                          <div className="ml-[14.5px] flex w-[376px]  flex-col gap-1 border-l  border-dotted border-secondary-label pl-7 pt-2 pb-6 ">
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-1">
                                <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
                                  {timeline_content.email_type
                                    ? timeline_content.email_type
                                    : timeline_content.type}
                                  :
                                </span>
                                {/* show toggle state for tags */}
                                {timeline_content.toggled_state && (
                                  <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
                                    {timeline_content.toggled_state} Tag -
                                  </span>
                                )}

                                {timeline_content.toggled_state ? (
                                  <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700"
                                  dangerouslySetInnerHTML={{ __html: timeline_content.label }}
                                  >
                                  </span>
                                ) : (
                                  <>
                                    {timeline_content.type === 'Email' ||
                                    timeline_content.type === 'SMS' ? (
                                      <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
                                        {timeline_content.id && timeline_content.id}
                                      </span>
                                    ) : (
                                      <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700" 
                                      dangerouslySetInnerHTML={{ __html: timeline_content.label }}
                                      >
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>

                              {timeline_content.note && (
                                <>
                                  <span
                                    className={`font-lato text-xs font-normal tracking-[0.2px] text-neutral-700`}
                                  >
                                    <span
                                      className={`font-lato text-xs font-normal tracking-[0.2px] text-neutral-700`}
                                    >
                                      {timeline_content.type === 'Email' ? 'Sub:' : 'Note:'}
                                    </span>{' '}
                                    {timeline_content.type === 'Email' ? (
                                      <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
                                        {timeline_content.label}
                                      </span>
                                    ) : (
                                      <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700"
                                      dangerouslySetInnerHTML={{ __html: timeline_content.note }}
                                      >
                                      </span>
                                    )}
                                  </span>
                                  {/* </div> */}

                                  {timeline_content.type === 'Email' && (
                                    <EmailBody
                                      body={timeline_content?.note}
                                      body_type={timeline_content?.body_type}
                                    />
                                  )}
                                </>
                              )}
                              {timeline_content.file && (
                                <a
                                  href={timeline_content?.file}
                                  target={'_blank'}
                                  rel="noreferrer"
                                  className="flex w-fit items-center gap-1 font-lato text-xs tracking-[0.2px] !text-primary-action"
                                >
                                  <span>
                                    {' '}
                                    <FileIcon className="m-0 h-3 w-3"></FileIcon>
                                  </span>
                                  <span>Document</span>
                                </a>
                              )}
                            </div>

                            {timeline_content.created_by ? (
                              <span className="font-lato text-xs font-normal tracking-[0.2px] text-tertiary">
                                by {timeline_content.created_by}{' '}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </InfiniteScroll>
      </div>
    );
  }
};
const EmailBody = ({ body_type, body }: { body_type: string; body: string }) => {
  const [showEmail, setShowEmail] = useState<boolean>(false);
  const handleShowEmail = () => {
    setShowEmail((prev) => !prev);
  };
  return (
    <>
      {showEmail && (
        <span className="font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
          Body:{' '}
          {body_type === 'html' ? (
            <p className="inline font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
              {getEmailBody(body)}
            </p>
          ) : (
            <span className="leading-1 font-lato text-xs font-normal tracking-[0.2px] text-neutral-700">
              {body}
            </span>
          )}
        </span>
      )}
      {showEmail ? (
        <span
          onClick={handleShowEmail}
          className="w-fit cursor-pointer font-lato text-xs font-bold tracking-[0.2px] text-primary-action"
        >
          Read less
        </span>
      ) : (
        <span
          onClick={handleShowEmail}
          className="w-fit cursor-pointer font-lato text-xs font-bold tracking-[0.2px] text-primary-action"
        >
          Read entire email
        </span>
      )}
    </>
  );
};
