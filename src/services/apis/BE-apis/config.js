import axios from "axios";
import { getFromLocalStorage } from "../../../utils";
import { LOCAL_STORAGE } from "../../../data";
import {
  BACKEND_DEV_URL,
  BACKEND_LOCAL_URL,
  BACKEND_PROD_URL,
  ENVIRONMENT,
} from "../../env/env";

export const API =
  ENVIRONMENT === "production"
    ? BACKEND_PROD_URL
    : ENVIRONMENT === "development"
    ? BACKEND_DEV_URL
    : ENVIRONMENT === "localhost"
    ? BACKEND_LOCAL_URL
    : BACKEND_LOCAL_URL;

// add default header (autherization and content type) in axios for all the calls except login api
// Create an instance of Axios
export const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const jwtToken =
      getFromLocalStorage(LOCAL_STORAGE.userAuthToken) ||
      getFromLocalStorage(LOCAL_STORAGE.privy);
    const fcAuthToken = getFromLocalStorage(LOCAL_STORAGE.FcComposerAuth);

    // Exclude the login API from adding the default header

    // Add your default header here
    config.headers["Authorization"] = fcAuthToken || `Bearer ${jwtToken}`;
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] = "*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
