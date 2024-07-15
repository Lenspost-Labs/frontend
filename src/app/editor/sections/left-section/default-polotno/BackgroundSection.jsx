import React from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import { Shapes } from 'polotno/side-panel/elements-panel';
import FaShapes from '@meronex/icons/fa/FaShapes';
import { t } from 'polotno/utils/l10n';
import Backgrounds_EditorIcon from '../../../../../assets/Editor-IconsV2/NotSelected/Backgrounds_EditorIcon';
import { useStore } from '../../../../../hooks/polotno';

const store = useStore();
export const BackgroundsPanel = ({ store }) => {
  return <Shapes store={store} />;
};

// // define the new custom section
export const BackgroundsSection = {
  name: 'backgrounds',
  Tab: observer((props) => (
    <SectionTab name={t('sidePanel.backgrounds')} {...props}>
      {/* <FaShapes /> */}
      <Backgrounds_EditorIcon isSelected={store?.openedSidePanel === "backgrounds" ? true : false}/>
    </SectionTab>
  )),
  // we need observer to update component automatically on any store changes
  Panel: BackgroundsPanel,
};