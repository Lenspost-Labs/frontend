// --------
// This is a custom horizontal scroller component
// Params to pass: `arrImages` is an object array of images to be displayed in the scroller,
// The object specific destructuring is to be done Ex: `arrImages.img` for Image, `arrImages.json` for JSON
// `propWidth` - width of the Image
// --------

import React, { useContext, useEffect, useRef, useState } from 'react'
import './Styles/index.css'
import CustomImageComponent from '../CustomImageComponent'
import BsChevronLeft from '@meronex/icons/bs/BsChevronLeft'
import BsChevronRight from '@meronex/icons/bs/BsChevronRight'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getAssetByQuery, getFeaturedAssets } from '../../../../../services'
import { Context } from '../../../../../providers/context'

const CustomHorizontalScroller = ({ type, author, campaign }) => {
	const [arrImages, setArrImages] = useState()
	const { isMobile, setOpenLeftBar, openLeftBar } = useContext(Context)
	const { data, isLoading, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryKey: [type, author, campaign],
		getNextPageParam: (prevData) => prevData.nextPage,
		queryFn: ({ pageParam = 1 }) => getAssetByQuery(type, author, campaign, pageParam),
	})

	const scrollWrapperRef = useRef(null)

	const distance = 300

	const fnScrollLeft = () => {
		scrollWrapperRef.current.scrollBy({
			left: -distance,
			behavior: 'smooth',
		})
	}
	const fnScrollRight = () => {
		scrollWrapperRef.current.scrollBy({
			left: distance,
			behavior: 'smooth',
		})
	}

	return (
		<>
			<div className="sectionWrapperImg">
				{/* Left and Right Buttons */}
				<div className="btnsWrapperImg" id="new">
					<div onClick={fnScrollLeft} id="button-left">
						{' '}
						<BsChevronLeft />{' '}
					</div>
					<div onClick={fnScrollRight} id="button-right">
						{' '}
						<BsChevronRight />{' '}
					</div>
				</div>

				{/* Images Inside the Horizontal scroller */}
				<div id="outsiderImg" ref={scrollWrapperRef}>
					<div className="divsWrapper" id="insiderImg">
						{data?.pages[0]?.data.length > 0 &&
							data?.pages
								.flatMap((item) => item?.data)
								// .slice(0, 10)
								.reverse()
								.map((item, index) => {
									return (
										<div
											key={index}
											id={index}
											className="eachDiv"
											onClick={() => {
												if (isMobile) {
													setOpenLeftBar(!openLeftBar)
												}
											}}
										>
											{' '}
											<CustomImageComponent
												key={index}
												item={item}
												assetType={null}
												collectionName={null}
												preview={item?.image}
												dimensions={item?.dimensions != null && item.dimensions}
												hasOptionBtn={null}
												onDelete={null}
												isLensCollect={null}
												recipientWallet={item?.wallet}
												showAuthor={null}
												author={item?.author}
											/>{' '}
										</div>
									)
								})}
					</div>
				</div>
			</div>
		</>
	)
}

export default CustomHorizontalScroller
