// import { ENVIRONMENT } from "../services";

import { ENVIRONMENT } from "../services/env/env";


export const consoleLogonlyDev = (msg) => {
  if (ENVIRONMENT === "development" || ENVIRONMENT === "localhost") {
    console.log(msg);
  }
};
