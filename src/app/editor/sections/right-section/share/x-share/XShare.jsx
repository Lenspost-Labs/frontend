import React, { useContext, useEffect, useRef, useState } from 'react'
import { SharePanelHeaders } from '../components'
import { Context } from '../../../../../../providers/context'
import { useSolanaWallet } from '../../../../../../hooks/solana'
import { shareOnSocials, twitterAuthenticate, XAuthenticated } from '../../../../../../services'
import { useLocalStorage } from '../../../../../../hooks/app'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import BiCopy from '@meronex/icons/bi/BiCopy'
import EmojiPicker, { EmojiStyle, Emoji } from 'emoji-picker-react'
import { Button, Spinner, Textarea, Typography } from '@material-tailwind/react'

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
	const { solanaAddress } = useSolanaWallet()
	const [isLoading, setIsLoading] = useState(false)
	const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false)
	const [charLimitError, setCharLimitError] = useState('')
	const [isShareLoading, setIsShareLoading] = useState(false)
	const [isShareSuccess, setIsShareSuccess] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isCopy, setIsCopy] = useState(false)
	const [tweetId, setTweetId] = useState('')
	const { xAuth } = useLocalStorage()
	const [twitterLoggedIn, setTwitterLoggedIn] = useState(false)
	const [twitterAuthLoading, setTwitterAuthLoading] = useState(false)
	const [isAuthChecking, setIsAuthChecking] = useState(true)
	const [canShare, setCanShare] = useState(true)
	const [timeRemaining, setTimeRemaining] = useState(0)

	const { mutateAsync: shareOnTwitter } = useMutation({
		mutationKey: 'shareOnTwitter',
		mutationFn: shareOnSocials,
	})

	const { mutateAsync: isAuthenticated } = useMutation({
		mutationKey: 'isAuthenticated',
		mutationFn: XAuthenticated,
	})
	// useEffect(() => {
	// 	if (!contextCanvasIdRef.current) {
	// 		toast.error('Please create a frame first')
	// 	}
	// }, [contextCanvasIdRef.current])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setStClickedEmojiIcon(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		checkTwitterAuth()
		checkShareCooldown()
		// Check remaining time every second if we're in cooldown
		const interval = setInterval(checkShareCooldown, 1000)
		return () => clearInterval(interval)
	}, [])

	const checkTwitterAuth = async () => {
		setIsAuthChecking(true)
		try {
			const res = await isAuthenticated()
			const isXAuthenticated = res?.data?.isAuthenticated
			if (isXAuthenticated) {
				setTwitterLoggedIn(true)
			}
		} catch (error) {
			console.error('Auth check failed:', error)
		} finally {
			setIsAuthChecking(false)
		}
	}

	const checkShareCooldown = () => {
		const lastShareTime = localStorage.getItem('lastTwitterShare')
		if (lastShareTime) {
			const cooldownPeriod = 30 * 60 * 1000 // 30 minutes in milliseconds
			const timeSinceLastShare = Date.now() - parseInt(lastShareTime)
			const remainingTime = cooldownPeriod - timeSinceLastShare

			if (remainingTime > 0) {
				setCanShare(false)
				setTimeRemaining(Math.ceil(remainingTime / 1000)) // Convert to seconds
			} else {
				setCanShare(true)
				setTimeRemaining(0)
				localStorage.removeItem('lastTwitterShare')
			}
		}
	}

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
				window.open(res?.data?.authUrl, '_parent')
			} else if (res?.error) {
				console.log(res?.error)
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async () => {
		if (!canShare) {
			toast.error(`Please wait ${formatTimeRemaining(timeRemaining)} before sharing again`)
			return
		}

		toast.info('Sharing on X is disabled for now!')
		return
		setIsShareLoading(true)
		try {
			const res = await isAuthenticated()
			const isXAuthenticated = res?.data?.isAuthenticated
			if (isXAuthenticated) {
				setTwitterLoggedIn(true)
				console.log('handleSubmit', isXAuthenticated)
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
						console.log('shareOnTwitter success', res?.data)
						if (res?.data?.tweetData) {
							// Store the share timestamp on success
							localStorage.setItem('lastTwitterShare', Date.now().toString())
							setCanShare(false)

							setIsShareLoading(false)
							setTweetId(res?.data?.tweetData?.data?.id)
							setIsShareSuccess(true)
							toast.success('Successfully shared')

							// Claim the task for the user
							claimReward({
								taskId: 3,
							})

							// open the dialog
						} else if (res?.error || res?.reason === 'REJECTED') {
							setIsError(true)
							setIsShareLoading(false)
							toast.error(res?.error)
						}
					})
					.catch((err) => {
						console.log('Full error:', err)
						console.log('Error response:', err.response)
						console.log('Error response data:', err?.response?.data)
						setIsError(true)
						setIsShareLoading(false)
						if (err?.response?.data?.message?.errors?.[0]?.message === 'Could not authenticate you') {
							twitterAuth()
						}
						if (err?.response?.data?.message?.errors?.length > 0) {
							toast.error(err?.response?.data?.message?.errors?.[0]?.message)
						} else {
							toast.error(err?.response?.data?.message)
						}
					})
			} else {
				setTwitterLoggedIn(false)
				toast.error('Please login to Twitter/X to share your frame')
				//twitterAuth()
			}
		} catch (error) {
			console.log('handleSubmit', error)
		} finally {
			setIsShareLoading(false)
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

	if (xAuth?.userName) {
		tweetUrl = `https://x.com/${xAuth.userName}/status/`
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
						) : !twitterLoggedIn && !xAuth?.userId ? (
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
										<Button className="w-full outline-none" disabled={isShareLoading || !canShare} loading={isShareLoading} onClick={handleSubmit}>
											{canShare ? 'Share on X' : `Wait ${formatTimeRemaining(timeRemaining)} to share again`}
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
