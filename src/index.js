import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// UI
import { ChakraProvider } from '@chakra-ui/react'

// STORAGE REDUX
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import scrollReducer from "./reducer/scrollReducer";
import searchReducer from "./reducer/searchReducer";

// QUERY CACHE
import { QueryClient, QueryClientProvider } from "react-query";
import trashReducer from "./reducer/trashReducer";

const queryClient = new QueryClient();

const store = configureStore({
    reducer: { 
      scroll: scrollReducer, 
      search: searchReducer,
      trash: trashReducer,
    }
})

const root = createRoot(document.getElementById("root"));
root.render(
<ChakraProvider>
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
