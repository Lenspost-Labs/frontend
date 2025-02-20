// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Button, Card, Menu, MenuItem, Position, Popover } from '@blueprintjs/core'
import { replaceImageURL } from '../../../../utils/replaceUrl'
import { useEffect, useState } from 'react'
import { useStore } from '../../../../hooks/polotno'
import { useContext } from 'react'
import { Context } from '../../../../providers/context/ContextProvider'
import { addressCrop, assetsTrack } from '../../../../utils'
import { useLocalStorage } from '../../../../hooks/app'

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
	item,
	assetType,
	collectionName,
	preview,
	dimensions,
	hasOptionBtn,
	onDelete,
	isLensCollect,
	changeCanvasDimension,
	recipientWallet,
	showAuthor,
	author,

	// For TopbarMobile
	imgClassName,
}) => {
	const store = useStore()
	const [base64Data, setBase64Data] = useState('')
	const {
		lensCollectNftRecipientDataRef,
		assetsRecipientDataRef,
		nftRecipientDataRef,
		assetsIdListRef,
		isMobile,
		actionType,
		setOpenBottomBar,
		setCurOpenedPanel,
		storyIPDataRef,

		setIsOnboardingOpen,
	} = useContext(Context)

	// convert to base64
	const getBase64 = async (image) => {
		const response = await fetch(image)
		const blob = await response.blob()
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = () => {
				const base64String = reader.result.split(',')[1]
				resolve(`data:image/svg+xml;base64,${base64String}`)
			}
			reader.readAsDataURL(blob)
		})
	}

	// funtion to check if preview has .svg extension
	const isSVG = (image) => {
		return image?.includes('.svg')
	}

	// Function to add image on the Canvas/Page
	const handleClickOrDrop = () => {
		if (isMobile) {
			setOpenBottomBar(false)
			setCurOpenedPanel(null)
		}
		changeCanvasDimension && store.setSize(dimensions[0] || item?.width, dimensions[1] || item?.height)

		var widthOnCanvas = 400
		var heightOnCanvas = 400

		if (dimensions && dimensions[0] && dimensions[1]) {
			widthOnCanvas = dimensions[0] / 4
			heightOnCanvas = dimensions[1] / 4
		}

		store.activePage?.addElement({
			type: 'image',
			src: base64Data, //Image URL
			width: changeCanvasDimension ? store.width : widthOnCanvas,
			height: changeCanvasDimension ? store.height : heightOnCanvas,
			x: changeCanvasDimension ? 0 : store.width / 4,
			y: changeCanvasDimension ? 0 : store.height / 4,
		})

		// NOTE: NO NEED OF THIS NOW
		// if nft is a lens collect, add it to the lensCollectNftRecipientDataRef
		// if (isLensCollect?.isLensCollect) {
		//   // if it is a the handle is @lenspostxyz.len, then don't add
		//   if (isLensCollect?.lensHandle?.startsWith("@lenspostxyz")) return;

		//   lensCollectNftRecipientDataRef.current.push({
		//     elementId: store.selectedElements[0]?.id,
		//     recipient: isLensCollect?.lensHandle,
		//   });
		// }

		// if nft is a featured bg, and has recipientWallet / wallet address/handle is present, add it to the assetsRecipientDataRef
		if (recipientWallet && recipientWallet.startsWith('@')) {
			assetsRecipientDataRef.current.push({
				elementId: store.selectedElements[0]?.id,
				recipient: recipientWallet,
			})
		} else if (recipientWallet) {
			assetsRecipientDataRef.current.push({
				elementId: store.selectedElements[0]?.id,
				recipient: recipientWallet,
			})
		}

		if (item?.id) {
			assetsIdListRef.current.push({
				elementId: store.selectedElements[0]?.id,
				assetId: item?.id,
			})
		}

		console.log('item', item)

		// if it is a story nft, add it to the storyIPDataRef
		if (item?.ip?.ipID && storyIPDataRef?.current) {
			storyIPDataRef.current.push({
				elementId: store.selectedElements[0]?.id,
				assetId: item?.id,
				ipID: item?.ip?.ipID,
				licenseTermsId: item?.ip?.licenseTermsId,
				tokenId: item?.ip?.tokenId,
				spgNftContract: item?.ip?.spgNftContract,
			})
		}

		// if it is a solana nft or eth nft, add creators address to the recipient list to solanaNftRecipientListRef
		if (item?.creators?.length > 0) {
			item?.creators.map((creator) => {
				nftRecipientDataRef.current.push({
					elementId: store.selectedElements[0]?.id,
					recipient: creator.address || creator.recipient,
				})
			})
		}

		// track assets selected
		assetsTrack(item, assetType, collectionName, actionType, isMobile)

		// Only to close onboarding modal on Image Drop
		setIsOnboardingOpen(false)
	}

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const image = await getBase64(replaceImageURL(preview))
				setBase64Data(image)
			} catch (error) {
				console.error('Error fetching or converting the image:', error)
			}
		}

		if (isSVG(replaceImageURL(preview))) {
			fetchImage()
		} else {
			setBase64Data(replaceImageURL(preview))
		}
	}, [preview])

	return (
		<>
			<Card className="relative p-0 m-1 rounded-lg h-fit" interactive onDragEnd={handleClickOrDrop} onClick={handleClickOrDrop}>
				{/* <div className="mb-3"> */}
				<LazyLoadImage className={`rounded-lg ${imgClassName}`} placeholderSrc={base64Data} effect="blur" src={base64Data} alt="Preview Image" />
				{/* </div> */}

				{/* if nft is a lens collect */}
				{isLensCollect?.isLensCollect || (recipientWallet && recipientWallet.startsWith('@')) ? (
					<>
						<div
							title="Collected from Lens"
							// className="bg-[#e1f16b] p-1 rounded-lg absolute top-2 left-2 opacity-60 hover:opacity-100"
							className="text-white text-xs bg-[#161616] px-2 py-0.5 rounded-md absolute top-2 right-2 opacity-96 hover:opacity-80"
							onClick={(e) => {
								e.stopPropagation()

								const onlyHandle = isLensCollect?.lensHandle?.split('@')[1] || recipientWallet?.split('@')[1]
								window.open(`https://hey.xyz/u/${onlyHandle}`, '_blank')
							}}
						>
							{isLensCollect?.lensHandle || recipientWallet}
						</div>
					</>
				) : (
					<></>
				)}

				{/* If the BE sends Wallet address - recipientWallet */}
				{/* Shorten it and Show on the FrontEnd */}
				{showAuthor && <div className="text-white appFont text-xs bg-[#161616] px-2 py-0.5 rounded-md absolute top-2 right-2 opacity-96"> {author} </div>}

				{hasOptionBtn && (
					<>
						{isMobile && (
							<div
								style={{ position: 'absolute', top: '5px', right: '5px' }}
								onClick={(e) => {
									e.stopPropagation()
								}}
							>
								<Button style={{ zIndex: 1000000 }} icon="trash" onClick={onDelete} />
							</div>
						)}
						{!isMobile && (
							<div
								style={{ position: 'absolute', top: '5px', right: '5px' }}
								onClick={(e) => {
									e.stopPropagation()
								}}
							>
								<Popover
									content={
										<Menu style={{ zIndex: 1000000 }}>
											<MenuItem style={{ zIndex: 1000000 }} icon="trash" text="Delete" onClick={onDelete} />
										</Menu>
									}
									position={Position.BOTTOM}
								>
									<div id="makePublic">
										<Button icon="more" />
									</div>
								</Popover>
							</div>
						)}
					</>
				)}
			</Card>
		</>
	)
}
export default CustomImageComponent
// Custom Image card component end - 23Jun2023
