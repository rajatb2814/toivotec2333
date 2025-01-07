import { startUpDataType as InitialDataParams } from 'types';
import { Root as InitialConfigParams } from 'types/configType';
import React, { createContext, useContext, useReducer } from 'react';
type InitialDataAction = {
  type: 'SET_DATA';
  // payload: InitialDataParams | null;
  payload: InitialConfigParams | null;
};

interface InitialDataState {
  // initialData: InitialDataParams | null;
  initialData: InitialConfigParams | null;
}

const InitialDataContext = createContext<InitialDataState>({
  initialData: null,
});

const InitialDataDispatchContext = createContext<React.Dispatch<InitialDataAction>>(() => {});

function initialDataReducer(initialData: InitialDataState, action: InitialDataAction) {
  switch (action.type) {
    case 'SET_DATA': {
      return {
        ...initialData,
        initialData: action.payload,
      };
    }
  }
}

export function InitialDataProvider({ children }: { children: React.ReactNode }) {
  const [initialDataState, dispatch] = useReducer(initialDataReducer, initialInitialDataState);

  return (
    <InitialDataContext.Provider value={initialDataState}>
      <InitialDataDispatchContext.Provider value={dispatch}>
        {children}
      </InitialDataDispatchContext.Provider>
    </InitialDataContext.Provider>
  );
}

export function useInitialData() {
  return useContext(InitialDataContext);
}

export function useInitialDataDispatch() {
  return useContext(InitialDataDispatchContext);
}

const initialInitialDataState = {
  initialData: null,
};
