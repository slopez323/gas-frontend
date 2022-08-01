import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Wrapper apiKey={process.env.REACT_APP_APIKEY} libraries={["places"]}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Wrapper>
  </React.StrictMode>
);
