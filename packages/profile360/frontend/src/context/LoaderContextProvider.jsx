import { createContext, useEffect, useMemo, useState } from 'react';

export const LoaderContext = createContext();

export default function LoaderContextProvider({ children }) {
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(isLoading);
    }
  }, [isLoading]);

  const contextValue = useMemo(() => {
    return { isVisible, setLoading, isLoading };
  }, [isVisible]);

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {/* {isLoading && <div className="global-overlay-spinner" />} */}
    </LoaderContext.Provider>
  );
}
