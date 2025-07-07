// --------
// This is the Top Share Panel Header component, just pass in:
// panelHeader - the Name to be displayed, menuName - name that's Linked Globally [ useContext - setMenu ]
// --------
import React, { useContext } from 'react'
import BsArrowLeft from '@meronex/icons/bs/BsArrowLeft'
import BsX from '@meronex/icons/bs/BsX'
import { Context } from '../../../../../../providers/context'

const SharePanelHeaders = ({ panelHeader, menuName, panelContent }) => {
	const { isShareOpen, setIsShareOpen, setMenu, isMobile } = useContext(Context)

	return (
		<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl rounded-lg rounded-r-none ">
			<div className="">
				{/* <Dialog.Title className="w-full flex items-center gap-2 text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10"> */}
				<div className="w-full flex justify-between items-center gap-2 text-white text-xl leading-6 p-4 bg-gray-900 rounded-lg rounded-r-none">
					{isMobile && (
						<BsArrowLeft onClick={() => setMenu('share')} className="cursor-pointer" />
					)}
					{!isMobile && (
						<>
							<BsArrowLeft onClick={() => setMenu('share')} className="cursor-pointer" />
						</>
					)}
					{panelHeader}
					{/* </Dialog.Title> */}
					<div className="z-100 cursor-pointer" onClick={() => setIsShareOpen(!isShareOpen)}>
						<BsX size="24" />
					</div>
				</div>
			</div>

			<div className="px-5">{panelContent}</div>
		</div>
	)
}

export default SharePanelHeaders
