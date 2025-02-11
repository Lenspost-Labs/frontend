import React, { useContext } from 'react'
import { SharePanelHeaders } from '../components'
import { Minting } from './Components'
import { Context } from '../../../../../../providers/context'
import Derivative from './Components/Derivative'

const StoryMint = ({ selectedChainId }) => {
	const { storyIPDataRef } = useContext(Context)

	const isStoryNFT = storyIPDataRef.current.length > 0
	console.log('isStoryNFT', isStoryNFT)
	console.log('storyIPDataRef', storyIPDataRef)
	return (
		<>
			<SharePanelHeaders menuName={'storyMint'} panelHeader={'Mint Options'} panelContent={isStoryNFT ? <Derivative /> : <Minting />} />
		</>
	)
}

export default StoryMint
