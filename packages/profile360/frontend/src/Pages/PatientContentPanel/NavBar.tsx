import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useInitialData } from 'context/InitialDataContext';
import { TimelineView } from './TimelineView/index';
import Programs from './Programs';
import IframeView from './IframeView'
import { getCookie, getUrl } from 'utils/helpers';
import { useParams } from 'react-router-dom';
export type CustomTabsData = Root[];
export interface Root {
  html_code: string;
  tab_label: string;
}

const NavBar = () => {
  const { initialData } = useInitialData();

  const [customTabs, setCustomTabs] = useState<CustomTabsData>();

  const { slug } = useParams();

  useEffect(() => {
    const FetchCustomTabs = () => {
      const csrftoken: string = getCookie('csrftoken');

      fetch(getUrl(slug), {
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrftoken ? csrftoken : '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          request_type: 'data',
          data_type: 'custom_tabs_data',
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log('check',result)
            setCustomTabs(result);
          },
          (error) => {}
        );
    };
    initialData?.custom_tab?.custom_tab_enabled && FetchCustomTabs();
  }, []);
  return (
    <div className="flex  grow  flex-col">
      <Tab.Group>
        <nav className="flex h-10  items-center border-b border-primary-border  py-3 px-6">
          <Tab.List className="invisible-scrollbar flex items-center justify-between gap-6 overflow-x-auto  ">
            {initialData?.timeline_view && initialData?.timeline_view?.enabled ? (
              <Tab
                key={1}
                className={({ selected }) =>
                  selected
                    ? 'font-lato text-xs font-bold tracking-[0.2px] text-neutral-700 outline-none '
                    : 'font-lato text-xs font-normal tracking-[0.2px] text-tertiary'
                }
              >
                Timeline View
              </Tab>
            ) : null}
            {initialData?.programs && initialData?.programs?.enabled ? (
              <Tab
                key={2}
                className={({ selected }) =>
                  selected
                    ? ' font-lato text-xs font-bold tracking-[0.2px] text-neutral-700 outline-none'
                    : 'font-lato text-xs font-normal tracking-[0.2px] text-tertiary'
                }
              >
                Cases
              </Tab>
            ) : null}
{initialData?.iframe_tab?.iframe_tab_enabled && initialData.iframe_tab.tabs?.length > 0 ? (
  initialData.iframe_tab.tabs.map((tab, idx) => (
    <Tab
      key={tab.name}
      className={({ selected }) =>
        selected
          ? 'font-lato text-xs font-bold tracking-[0.2px] text-neutral-700 outline-none'
          : 'font-lato text-xs font-normal tracking-[0.2px] text-tertiary'
      }
    >
      {tab.name || "IFrame View"}
    </Tab>
  ))
) : null}

            {customTabs?.map((tab, index) => {
              return (
                <Tab
                  key={index + 3}
                  className={({ selected }) =>
                    selected
                      ? ' font-lato text-xs font-bold tracking-[0.2px] text-neutral-700 outline-none'
                      : 'font-lato text-xs font-normal tracking-[0.2px] text-tertiary'
                  }
                >
                  {tab.tab_label}
                </Tab>
              );
            })}
          </Tab.List>
        </nav>

        <div className="flex flex-grow flex-col">
          <Tab.Panels className="flex flex-grow">
            {initialData?.timeline_view && initialData?.timeline_view?.enabled ? (
              <Tab.Panel key={1} className="flex flex-grow flex-col">
                <TimelineView />
              </Tab.Panel>
            ) : null}
            {initialData?.programs && initialData?.programs?.enabled ? (
              <Tab.Panel key={2} className="flex flex-grow flex-col">
                <Programs />
              </Tab.Panel>
            ) : null}
            {initialData?.iframe_tab?.iframe_tab_enabled && initialData.iframe_tab.tabs?.length > 0 ? (
  initialData.iframe_tab.tabs.map((tab, idx) => (
    <Tab.Panel key={tab.name} className="flex flex-grow flex-col">
      <IframeView iframe_tab={tab} />
    </Tab.Panel>
  ))
) : null}

            {customTabs?.map((tab, index) => {
              return (
                <Tab.Panel className="flex flex-grow flex-col" key={index + 3}>
                  {/* <iframe></iframe> */}
                  <div
                    className="flex flex-grow flex-col"
                    dangerouslySetInnerHTML={{
                      __html: tab.html_code,
                    }}
                  ></div>
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default NavBar;
// className="cursor-pointer font-lato text-xs font-normal tracking-[0.2px] focus:font-bold"