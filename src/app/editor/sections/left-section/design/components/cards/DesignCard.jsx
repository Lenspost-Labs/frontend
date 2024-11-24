import React, { useContext } from 'react'
import { Button, Card } from '@blueprintjs/core'

import { LazyLoadImage } from 'react-lazy-load-image-component'

import { useStore } from '../../../../../../../hooks/polotno'
import { Context } from '../../../../../../../providers/context/ContextProvider'
import { replaceImageURL } from '../../../../../../../utils'
import { useState } from 'react'

// Design card component start - 23Jun2023
const DesignCard = ({ item, preview, json, onDelete, onPublic, isPublic, openTokengateModal, onOpenTagModal, hasWatermark }) => {
	const {
		fastPreview,
		contextCanvasIdRef,
		referredFromRef,
		preStoredRecipientDataRef,
		designModal,
		setDesignModal,
		isMobile,
		setOpenLeftBar,
		setRemovedWMarkCanvas,
	} = useContext(Context)
	const store = useStore()
	const [isImageLoaded, setIsImageLoaded] = useState(false)

	const handleClickOrDrop = () => {
		if (isMobile) {
			setOpenLeftBar(false)
		}
		contextCanvasIdRef.current = item.id
		if (!hasWatermark) {
			setRemovedWMarkCanvas(item?.id)
		}
		store.loadJSON(json)
		referredFromRef.current = item.referredFrom
		preStoredRecipientDataRef.current = item.assetsRecipientElementData
	}

	const image = contextCanvasIdRef.current === item.id ? fastPreview[0] : replaceImageURL(preview)

	return (
		<Card
			className={`relative p-0 m-1 rounded-lg h-fit ${!isImageLoaded ? 'border-0 p-0 !m-0 opacity-0 h-0 w-0 bg-white rounded-lg' : ''}`}
			interactive
			onDragEnd={handleClickOrDrop}
			onClick={handleClickOrDrop}
		>
			<div className="rounded-lg overflow-hidden">
				<LazyLoadImage
					placeholderSrc={replaceImageURL(preview)}
					effect="blur"
					src={image}
					onLoad={() => {
						setIsImageLoaded(true)
					}}
					alt="Preview Image"
				/>
			</div>

			{isImageLoaded && (
				<>
					<div
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							// padding: "3px",
						}}
					>
						{/* {design.name} */}
					</div>
					<div
						style={{ position: 'absolute', top: '5px', right: '5px' }}
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<Button icon="trash" onClick={onDelete} />
						{!isMobile && (
							<Button
								className="ml-1"
								onClick={() => {
									setDesignModal(true)
									onOpenTagModal()
								}}
								icon="share"
							/>
						)}
					</div>{' '}
				</>
			)}
		</Card>
	)
}

// Design card component end - 23Jun2023

export default DesignCard
