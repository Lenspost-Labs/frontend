import React, { useContext, useState } from 'react'
import { SharePanelHeaders } from '../components'
import { Minting } from './Components'
import { Context } from '../../../../../../providers/context'
import Derivative from './Components/Derivative'
import { LP721Edition } from '../zora-mint/components'
import { Tabs, TabsHeader, TabsBody, Tab, Typography, TabPanel } from '@material-tailwind/react'
import { storyAeneidTestnet, storyMainnet } from '../../../../../../data'
import { ENVIRONMENT } from '../../../../../../services'

const StoryMint = ({ selectedChainId }) => {
	const { storyIPDataRef } = useContext(Context)

	const isStoryNFT = storyIPDataRef?.current?.length > 0

	const [storyTab, setStoryTab] = useState(isStoryNFT ? 'registerDerivative' : 'registerIP')
	return (
		<>
			<SharePanelHeaders
				menuName={'storyMint'}
				panelHeader={'Story IP Options'}
				panelContent={
					<>
						<Tabs className="overflow-y-auto my-2" value={storyTab}>
							<TabsHeader>
								{isStoryNFT ? (
									<Tab value="registerDerivative" onClick={() => setStoryTab('registerDerivative')}>
										Register Derivative
									</Tab>
								) : (
									<Tab value="registerIP" onClick={() => setStoryTab('registerIP')}>
										Register IP
									</Tab>
								)}
								<Tab value="minting" onClick={() => setStoryTab('minting')}>
									Mint Edition
								</Tab>
							</TabsHeader>
							<TabsBody className="!p-0">
								{storyTab === 'registerDerivative' && <Derivative />}
								{storyTab === 'registerIP' && <Minting />}

								{storyTab === 'minting' && (
									<LP721Edition
										isOpenAction={false}
										isFarcaster={false}
										selectedChainId={ENVIRONMENT === 'development' ? storyAeneidTestnet.id : storyMainnet.id}
									/>
								)}
							</TabsBody>
						</Tabs>
					</>
				}
			/>
		</>
	)
}

export default StoryMint
