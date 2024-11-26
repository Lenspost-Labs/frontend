import React, { useContext } from 'react'
import { SharePanelHeaders } from '../components'
import { Minting } from './Components'

const StoryMint = ({ selectedChainId }) => {
	return (
		<>
			<SharePanelHeaders menuName={'storyMint'} panelHeader={'Mint Options'} panelContent={<Minting />} />
		</>
	)
}

export default StoryMint
