import { useContext } from "react";
import { Context } from "../../../../providers/context";

const useMobilePanelFunctions = () => {
  const {
    curOpenedPanel,
    setCurOpenedPanel,
    setOpenBottomBar,
    setOpenLeftBar,
  } = useContext(Context);

  // Only for Bottom bar to open a particular panel
  const fnOpenPanel = (panelName: string) => {
    setCurOpenedPanel(panelName);
    setOpenBottomBar(true);
    // If the panel is already open, close it on click of the same Icon
    // Like - Toggle Bottom Bar Icon
    if (panelName === curOpenedPanel) {
      setOpenBottomBar(false);
      setCurOpenedPanel(null);
    }
  };

  // Function to close the LeftBar and open the same section
  const fnCloseLeftOpenEditorPanel = (panelName: string) => {
    setCurOpenedPanel(panelName);
    fnOpenPanel(panelName);
    setOpenLeftBar(false);
  };

  return { fnOpenPanel, fnCloseLeftOpenEditorPanel };
};

export default useMobilePanelFunctions;
