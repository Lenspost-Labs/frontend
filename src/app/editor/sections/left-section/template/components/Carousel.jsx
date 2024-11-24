// --------
// This is a component that wraps as a carousel for the `image array` passed
// Params: `arrData` is the object array that contain all the json, preview, dimensions, etc
// --------

import { Carousel } from '@material-tailwind/react'
import { CustomImageComponent } from '../../../../common'
import { getAssetByQuery, getFeaturedAssets } from '../../../../../../services'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../../../../providers/context'

const CompCarousel = ({ type, author, campaign }) => {
	const { isMobile, setOpenLeftBar, openLeftBar } = useContext(Context)

	const { data, isLoading, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryKey: [type, author, campaign],
		getNextPageParam: (prevData) => prevData.nextPage,
		queryFn: ({ pageParam = 1 }) => getAssetByQuery(type, author, campaign, pageParam),
	})

	return (
		<Carousel
			autoplay={true}
			className="rounded-xl h-56  overflow-hidden"
			navigation={({ setActiveIndex, activeIndex, length }) => (
				<div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
					{new Array(length).fill('').map((_, i) => (
						<span
							key={i}
							className={`block h-1 cursor-pointer rounded-2xl transition-all text-black content-[''] ${
								activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
							}`}
							onClick={() => setActiveIndex(i)}
						/>
					))}
				</div>
			)}
		>
			{/* `arrData` - Data Object array and it's destructuring `arrData.data`, `arrData.preview` */}
			{data?.pages[0]?.data.length > 0 &&
				data?.pages
					.flatMap((item) => item?.data)
					.slice(0, 6)
					.map((item, index) => {
						return (
							<div
								key={index}
								className=""
								onClick={() => {
									if (isMobile) {
										setOpenLeftBar(!openLeftBar)
									}
								}}
							>
								<CustomImageComponent
									key={index}
									item={item}
									assetType={null}
									collectionName={null}
									preview={item?.image}
									dimensions={item?.dimensions != null && item.dimensions}
									hasOptionBtn={null}
									onDelete={null}
									isLensCollect={item?.wallet}
									changeCanvasDimension={true}
									recipientWallet={item?.wallet}
									showAuthor={true}
									author={item?.author}
								/>
							</div>
						)
					})}
		</Carousel>
	)
}

export default CompCarousel
