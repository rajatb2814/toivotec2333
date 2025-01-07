import {useState, useEffect}from 'react'
import { IFrameSingleTab, IFrameTabs } from 'types/configType'

const IframeView = ({ iframe_tab }:{iframe_tab:IFrameSingleTab}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: `calc(100vh - 39px)`, position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'white',
        }}>
          <span className="loader"></span>
          {/* <div className="global-overlay-spinner" /> */}
        </div>
      )}
      <iframe
        src={iframe_tab.url}
        title="Example Website"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default IframeView;
