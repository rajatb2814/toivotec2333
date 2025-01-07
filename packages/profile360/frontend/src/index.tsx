import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/Index';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { InitialDataProvider } from './context/InitialDataContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorMessageContextProvider from 'context/ErrorMessageContextProvider';
import LoaderContextProvider from 'context/LoaderContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// @ts-ignore
// let appUrl = app_url;
//below comment is for local servers
let appUrl = window.location.pathname;
root.render(
  <InitialDataProvider>
    <ErrorMessageContextProvider>
      <LoaderContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={appUrl} element={<App />} />
          </Routes>
        </BrowserRouter>
      </LoaderContextProvider>
    </ErrorMessageContextProvider>
  </InitialDataProvider>
);

reportWebVitals();
