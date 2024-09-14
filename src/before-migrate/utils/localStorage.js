// save data to local storage
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (e) {
    console.log(e);
  }
};
// get data from local storage
export const getFromLocalStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) return undefined;
    return JSON.parse(serializedValue);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

// remove data from local storage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
}
