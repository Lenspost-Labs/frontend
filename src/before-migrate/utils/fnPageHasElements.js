// --------
// Function to check if a page has elements
// --------

import { useStore } from "../hooks/polotno";

export const fnPageHasElements = (store) => {

    if(store.activePage.children.length > 0){
        console.log("true")
        return true;
    } 
    // else return false;
}