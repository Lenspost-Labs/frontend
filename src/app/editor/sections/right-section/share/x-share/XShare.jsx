import React, { useContext, useState } from 'react'
import { SharePanelHeaders } from '../components'
import { Button } from '@material-tailwind/react'
import { Context } from '../../../../../../providers/context'
import { useSolanaWallet } from '../../../../../../hooks/solana'
import { shareOnSocials, twitterAuthenticate } from '../../../../../../services'
import { useLocalStorage } from '../../../../../../hooks/app'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import BiCopy from '@meronex/icons/bi/BiCopy'

const XShare = () => {
	const { postName, postDescription, contextCanvasIdRef } = useContext(Context)
	const { solanaAddress } = useSolanaWallet()
	const [isLoading, setIsLoading] = useState(false)
	const [isShareLoading, setIsShareLoading] = useState(false)
	const [isShareSuccess, setIsShareSuccess] = useState(false)
	const [isError, setIsError] = useState(false)
	const [isCopy, setIsCopy] = useState(false)
	const [tweetId, setTweetId] = useState('')
	const { xAuth } = useLocalStorage()

	const { mutateAsync: shareOnTwitter } = useMutation({
		mutationKey: 'shareOnTwitter',
		mutationFn: shareOnSocials,
	})

	// Aurh for twitter
	const twitterAuth = async () => {
		setIsLoading(true)
		try {
			const res = await twitterAuthenticate()
			if (res?.data) {
				window.open(res?.data?.authUrl, '_parent')
			} else if (res?.error) {
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = () => {
		setIsShareLoading(true)
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
				if (res?.tweetData) {
					setIsShareLoading(false)
					setTweetId(res?.tweetData?.data?.id)
					setIsShareSuccess(true)

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
				setIsError(true)
				setIsShareLoading(false)
				toast.error(errorMessage(err))
			})
	}

	let tweetUrl = `https://x.com/${xAuth.userName}/status/`

	return (
		<>
			<SharePanelHeaders
				menuName={'X'}
				panelHeader={'Share Options'}
				panelContent={
					<>
						{isShareSuccess && (
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
						)}
						{!xAuth && !xAuth?.userId ? (
							<div className="flex py-5 px-5 text-center gap-5 flex-col items-center justify-center">
								<p className="text-sm text-gray-500">You're not logged in to Twitter/X, Please login to share your frame</p>
								<Button className="w-full outline-none" loading={isLoading} onClick={twitterAuth}>
									Login
								</Button>
							</div>
						) : (
							!isShareSuccess && (
								<div className="mx-2 my-2 outline-none">
									<Button className="w-full outline-none" loading={isShareLoading} onClick={handleSubmit}>
										Share
									</Button>
								</div>
							)
						)}
					</>
				}
			/>
		</>
	)
}

export default XShare
