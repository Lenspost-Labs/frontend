import React, { useContext, useEffect, useRef, useState } from 'react'
import { SharePanelHeaders } from '../components'
import { Context } from '../../../../../../providers/context'
import { useSolanaWallet } from '../../../../../../hooks/solana'
import { claimReward, disconnectTwitter, shareOnX, twitterAuthenticate, XAuthenticated } from '../../../../../../services'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@tanstack/react-query'
import BiCopy from '@meronex/icons/bi/BiCopy'
import EmojiPicker, { EmojiStyle, Emoji } from 'emoji-picker-react'
import { Button, Spinner, Textarea, Typography } from '@material-tailwind/react'
import { errorMessage } from '../../../../../../utils'

import coinImg from '../../../../../../assets/svgs/Coin.svg'
import useUser from '../../../../../../hooks/user/useUser'
import { posterTokenSymbol } from '../../../../../../data'

const XShare = () => {
	const {
		setMenu,
		postName,
		setPostName,
		postDescription,
		setPostDescription,
		stFormattedDate,
		setStFormattedDate,
		stFormattedTime,
		setStFormattedTime,
		stCalendarClicked,
		setStCalendarClicked,
		setZoraTab,

		isShareOpen,
		setIsShareOpen,

		contextCanvasIdRef,
		actionType,
		isMobile,
	} = useContext(Context)
	const emojiPickerRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)
	const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false)
	const [charLimitError, setCharLimitError] = useState('')
	const [isShareLoading, setIsShareLoading] = useState(false)
	const [isShareSuccess, setIsShareSuccess] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isCopy, setIsCopy] = useState(false)
	const [tweetId, setTweetId] = useState('')
	const [xAuth, setXAuth] = useState(null)
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false)
	const [twitterAuthLoading, setTwitterAuthLoading] = useState(false)
	const [timeRemaining, setTimeRemaining] = useState(0)

	const { points } = useUser()

	const { mutateAsync: shareOnTwitter } = useMutation({
		mutationKey: 'shareOnTwitter',
		mutationFn: shareOnX,
	})

	const { data: authData, isLoading: isAuthChecking } = useQuery({
		queryKey: ['isAuthenticated'],
		queryFn: XAuthenticated,
		refetchOnWindowFocus: true,
	})

	useEffect(() => {
		if (authData?.data?.isAuthenticated) {
			setXAuth(authData?.data?.username)
			setTwitterLoggedIn(true)
		}
	}, [authData])

	// useEffect(() => {
	// 	if (!contextCanvasIdRef.current) {
	// 		toast.error('Please create a frame first')
	// 	}
	// }, [contextCanvasIdRef.current])

	const formatTimeRemaining = (seconds) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	// Aurh for twitter
	const twitterAuth = async () => {
		setIsLoading(true)
		try {
			const res = await twitterAuthenticate()
			if (res?.data) {
				window.open(res?.data?.authUrl, '_blank')
			} else if (res?.error) {
				console.log(res?.error)
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(errorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async () => {
		setIsShareLoading(true)
		if (!points) {
			toast.error(`Error Fetching ${posterTokenSymbol} Points`)
			return
		}
		if (points < 1 || points < 30) {
			toast.error(`Not enough ${posterTokenSymbol} points`)
			return
		}
		try {
			const canvasData = {
				id: contextCanvasIdRef.current,
				name: 'Twitter post',
				content: postDescription,
			}
			shareOnTwitter({
				canvasData: canvasData,
				canvasParams: '',
				platform: 'twitter',
			})
				.then((res) => {
					if (res?.data?.tweetData) {
						// Store the share timestamp on success
						//localStorage.setItem('lastTwitterShare', Date.now().toString())

						setTweetId(res?.data?.tweetData?.id)
						setIsShareSuccess(true)
						setIsShareLoading(false)
						toast.success('Successfully shared')

						// Claim the task for the user
						claimReward({
							taskId: 3,
						})

						// open the dialog
					} else if (res?.error || res?.reason === 'REJECTED') {
						setIsError(true)
						toast.error(res?.error)
					}
				})
				.catch((err) => {
					setIsShareLoading(false)
					console.log('Full error:', err)
					toast.error(errorMessage(err))
				})
		} catch (error) {
			console.log('handleSubmit', error)
		} finally {
			//setIsShareLoading(false)
		}
	}

	const handleDisconnect = async () => {
		setIsLoading(true)
		try {
			const res = await disconnectTwitter()
			if (res?.data) {
				toast.success('Successfully disconnected!')
				setTwitterLoggedIn(false)
				setXAuth(null)
			} else if (res?.error) {
				console.log(res?.error)
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error.message)
			toast.error(errorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	// Function to handle emoji click
	// Callback sends (data, event) - Currently using data only
	function fnEmojiClick(emojiData) {
		setPostDescription(postDescription + emojiData?.emoji) //Add emoji to description
	}

	const handleInputChange = (e) => {
		const value = e.target.value
		const name = e.target.name
		const maxByteLimit = 195
		const byteLength = new TextEncoder().encode(value).length

		if (name === 'title') {
			setPostName(value)
			if (isMobile) {
				setPostName('Default Title')
			}
		} else if (name === 'description') {
			if (byteLength > maxByteLimit) {
				setCharLimitError('Maximun character limit exceeded')
				setPostDescription(value.substring(0, value.length - (byteLength - maxByteLimit)))
			} else {
				setCharLimitError('')
				setPostDescription(value)
			}
		}
	}

	let tweetUrl = ''

	if (xAuth) {
		tweetUrl = `https://x.com/${xAuth}/status/`
	}

	// Add click handler to focus window
	const handleWindowClick = () => {
		window.focus()
	}

	return (
		<>
			<SharePanelHeaders
				menuName={'X'}
				panelHeader={'Share Options'}
				panelContent={
					<>
						{isAuthChecking ? (
							<div className="flex py-5 px-5 text-center gap-5 flex-col items-center justify-center">
								<Spinner />
							</div>
						) : isShareSuccess ? (
							<div className="flex flex-col pt-10 py-5 gap-2 items-center justify-center">
								Successfully shared.
								<span className="flex gap-1 items-center">
									Check your post on
									<a href={tweetUrl + tweetId} target="_blank" rel="noreferrer" className="text-blue-500">
										Twitter/X
									</a>
									<BiCopy
										onClick={() => {
											navigator.clipboard.writeText(tweetUrl + tweetId)
											setIsCopy({
												id: 1,
											})
										}}
										className="cursor-pointer"
									/>
									{isCopy?.id === 1 && <span className="text-green-500">Copied</span>}
								</span>
							</div>
						) : !xAuth || !twitterLoggedIn ? (
							<div className="flex py-5 px-5 text-center gap-5 flex-col items-center justify-center">
								<p className="text-sm text-gray-500">You're not logged in to Twitter/X, Please login to share your frame</p>
								<Button className="w-full outline-none" loading={isLoading} onClick={twitterAuth}>
									Login To X
								</Button>
							</div>
						) : (
							!isShareSuccess && (
								<>
									<div className="relative mt-0 px-4 pt-1 pb-1 sm:px-4s">
										<div className="space-y-4">
											<div className="flex items-center justify-between"></div>
											{/* <InputBox
												label={"Title"}
												name="title"
												autoFocus={true}
												onChange={(e) => handleInputChange(e)}
												value={postName}
											/> */}
											<div className="space-x-2">
												{!isMobile && (
													<>
														<Textarea
															label="Description"
															name="description"
															onChange={(e) => handleInputChange(e)}
															value={postDescription}
															// placeholder="Write a description..."
															// className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
														/>
														{charLimitError && <div className="text-red-500 text-sm">{charLimitError}</div>}
													</>
												)}

												{/* Using default textarea from HTML to avoid unnecessary focus only for mobile */}
												{/* iPhone issue */}
												{isMobile && (
													<>
														<textarea
															cols={30}
															type="text"
															className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
															label="Description"
															name="description"
															onChange={(e) => handleInputChange(e)}
															value={postDescription}
															placeholder="Write a description..."
															// className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
														/>
														{charLimitError && <div className="text-red-500 text-sm">{charLimitError}</div>}
													</>
												)}

												<div className="flex flex-row">
													{/* Open the emoji panel - 22Jul2023 */}
													{/* Dynamic Emoji on the screen based on click */}

													<button
														title="Open emoji panel"
														className={`"rounded-md ${stClickedEmojiIcon && 'pt-1'}"`}
														onClick={(event) => {
															event.stopPropagation()
															setStClickedEmojiIcon(!stClickedEmojiIcon)
														}}
													>
														<Emoji unified={stClickedEmojiIcon ? '274c' : '1f60a'} emojiStyle={EmojiStyle.NATIVE} size={22} />
													</button>
													<div
														onClick={() => {
															setStCalendarClicked(!stCalendarClicked)
															setStShareClicked(true)
														}}
														className=" py-2 rounded-md cursor-pointer"
													>
														{/* <MdcCalendarClock className="h-10 w-10" /> */}
													</div>
												</div>

												{/* Emoji Implementation - 21Jul2023 */}
												{stClickedEmojiIcon && (
													<div className="shadow-lg mt-2 absolute z-40" ref={emojiPickerRef}>
														<EmojiPicker
															onEmojiClick={fnEmojiClick}
															autoFocusSearch={true}
															// width="96%"
															className="m-0"
															lazyLoadEmojis={true}
															previewConfig={{
																defaultCaption: 'Pick one!',
																defaultEmoji: '1f92a', // 🤪
															}}
															searchPlaceHolder="Search"
															emojiStyle={EmojiStyle.NATIVE}
														/>
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="mx-4 my-2 outline-none">
										<Button className="w-full outline-none" disabled={isShareLoading} loading={isShareLoading} onClick={handleSubmit}>
											{isShareLoading ? 'Sharing on X...' : 'Share on X'} <img className="h-4 -mt-1 ml-2" src={coinImg} alt="" />
										</Button>
										<Button color="red" className="w-full mt-3 outline-none" disabled={isShareLoading} onClick={handleDisconnect}>
											Disconnect
										</Button>
										{!twitterLoggedIn && (
											<div className="flex py-5 text-center gap-5 flex-col items-center justify-center">
												<Button className="w-full outline-none" disabled={isLoading} loading={isLoading} onClick={twitterAuth}>
													Login To X
												</Button>
											</div>
										)}
									</div>
								</>
							)
						)}
					</>
				}
			/>
		</>
	)
}

export default XShare
