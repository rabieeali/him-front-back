import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from "./app/store"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"

import "./assets/IRANSansWeb/Iransansx.css"


// let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}> */}
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);
