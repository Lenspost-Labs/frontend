// import createStore from "polotno/model/store";
// import { POLOTNO_API_KEY } from "../../services";

// const store = createStore({ key: POLOTNO_API_KEY });
// store.addPage();

// const useStore = () => {
//   return store;
// };

// export default useStore;


import { useState, useEffect } from 'react';

let store;

const useStore = () => {
  const [storeInstance, setStoreInstance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('polotno/model/store').then((module) => {
        const createStore = module.default;
        if (!store) {
          const { POLOTNO_API_KEY } = require('../../services');
          store = createStore({ key: POLOTNO_API_KEY });
          store.addPage();
        }
        setStoreInstance(store);
      });
    }
  }, []);

  return storeInstance;
};

export default useStore;