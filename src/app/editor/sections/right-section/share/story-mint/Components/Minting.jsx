import { useContext } from 'react'
import { Context } from '../../../../../../../providers/context'
import { useAppAuth, useReset } from '../../../../../../../hooks/app'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { uploadAsIP, uploadJSONtoIPFS, uploadUserAssetToIPFS } from '../../../../../../../services'
import { toast } from 'react-toastify'
import useMint721 from '../../../../../../../hooks/mint721/useMint721'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { useEffect } from 'react'
import { addressCrop, getFromLocalStorage } from '../../../../../../../utils'
import { LOCAL_STORAGE, STORY_ODYSSEY_ADDRESS } from '../../../../../../../data'
import { storyMainnet } from '../../../../../../../data'
import storyABI from '../../../../../../../data/json/storyABI.json'
import { InputBox, SelectBox } from '../../../../../common'
import { EVMWallets } from '../../../../top-section/auth/wallets'
import { Button, Textarea } from '@material-tailwind/react'
import useReownAuth from '../../../../../../../hooks/reown-auth/useReownAuth'
import { getOrCreateWallet } from '../../../../../../../services/apis/BE-apis'
import { Topup } from '../../farcaster-share/components'

const getPILTypeString = (type) => {
	switch (type) {
		case 0:
			return 'NON_COMMERCIAL_REMIX'
		case 2:
			return 'COMMERCIAL_REMIX'
		case 1:
			return 'COMMERCIAL_USE'
		default:
			return ''
	}
}

const licenseOptions = [
	{
		label: 'Non-Commercial Remix',
		value: getPILTypeString(0),
	},
	{
		label: 'Commercial Remix',
		value: getPILTypeString(2),
	},
]

const revenueShareOptions = [
	{ label: '0', value: '0' },
	{ label: '10', value: '10' },
	{ label: '20', value: '20' },
	{ label: '30', value: '30' },
	{ label: '40', value: '40' },
	{ label: '50', value: '50' },
	{ label: 'Custom', value: 'custom' },
]

const Minting = () => {
	const { postDescription, setMenu, canvasBase64Ref, setPostDescription, contextCanvasIdRef, isMobile } = useContext(Context)
	const { resetState } = useReset()
	const { login } = useReownAuth()
	const { isAuthenticated } = useAppAuth()
	const { address, isConnected } = useAccount()

	const [charLimitError, setCharLimitError] = useState('')

	const {
		error: errorSwitchNetwork,
		isError: isErrorSwitchNetwork,
		isLoading: isLoadingSwitchNetwork,
		isSuccess: isSuccessSwitchNetwork,
		switchChain,
	} = useSwitchChain()

	const chainId = useChainId()

	const [collectionName, setCollectionName] = useState('')
	const [revShare, setRevShare] = useState(0)
	const [license, setLicense] = useState('')
	const [customRevShare, setCustomRevShare] = useState('')

	const [creatorName, setCreatorName] = useState('')
	const [creatorDescription, setCreatorDescription] = useState('')
	const [twitter, setTwitter] = useState('')
	const [farcaster, setFarcaster] = useState('')
	const [ipResult, setIPResult] = useState(null)

	const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth)

	const {
		data: walletData,
		isError: isWalletError,
		isLoading: isWalletLoading,
		error: walletError,
		isSuccess: isWalletSuccess,
		refetch: refetchWallet,
		isRefetching: isWalletRefetching,
	} = useQuery({
		queryKey: ['getOrCreateWallet'],
		queryFn: () => getOrCreateWallet(storyMainnet?.id),
		refetchOnWindowFocus: false,
	})

	const {
		mutate: uploadIP,
		isPending: isUploadIPPending,
		isSuccess: isUploadIPSuccess,
		isError: isUploadIPError,
		error: uploadIPError,
	} = useMutation({
		mutationKey: 'uploadIP',
		mutationFn: uploadAsIP,
	})

	// upload to IPFS Mutation
	const {
		mutate,
		data: uploadData,
		isError: isUploadError,
		error: uploadError,
		isSuccess: isUploadSuccess,
		isLoading: isUploading,
		isPending: isUploadPending,
	} = useMutation({
		mutationKey: 'uploadToIPFS',
		mutationFn: uploadUserAssetToIPFS,
	})

	// upload JSON data to IPFS
	useEffect(() => {
		if (uploadData?.message) {
			const collectionSymbol =
				collectionName.split(' ').length === 1
					? collectionName.slice(0, 3).toUpperCase()
					: collectionName
							.split(' ')
							.map((word) => word.charAt(0).toUpperCase())
							.join('')
			let jsonData = {
				brandName: collectionName,
				brandSymbol: collectionSymbol,
				brandDescription: postDescription,
				images: [`ipfs://${uploadData?.message}`],
				mintFeeRecipient: address,
				pilType: license,
				pilTerms: {},
				metadata: {
					title: collectionName,
					description: postDescription,
					creators: {
						name: creatorName,
						bio: creatorDescription,
						socialMedia: [
							{
								platform: 'twitter',
								url: twitter,
							},
							{
								platform: 'farcaster',
								url: farcaster,
							},
						],
					},
				},
			}

			let pilTerms = {}

			if (license === getPILTypeString(2)) {
				pilTerms = {
					mintingFee: 0,
					currency: '0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5',
					commercialRevShare: revShare,
				}
			}

			jsonData = { ...jsonData, pilTerms }
			uploadIP(jsonData).then((res) => {
				console.log('uploadIP', res)
				setIPResult(res)
			})
		}
	}, [isUploadSuccess])

	useEffect(() => {
		if (isUploadIPError) {
			console.log(uploadIPError)
			toast.error(uploadIPError?.message)
		}
	}, [isUploadIPError, uploadIPError])

	useEffect(() => {
		if (isUploadError) {
			console.log(uploadError)
			toast.error(uploadError?.message)
		}
	}, [isUploadError, uploadError])

	useEffect(() => {
		if (isUploadIPSuccess) {
			//resetState()
			toast.success('IP registered successfully!')
		}
	}, [isUploadIPSuccess])

	// Add a new state to track if custom is selected
	const [isCustomSelected, setIsCustomSelected] = useState(false)

	const handleInputChange = (e) => {
		const value = e.target.value
		const name = e.target.name
		const maxByteLimit = 195
		const byteLength = new TextEncoder().encode(value).length

		if (name === 'title') {
			setCollectionName(value)
			if (isMobile) {
				setCollectionName('Default Title')
			}
		} else if (name === 'creatorName') {
			setCreatorName(value)
			if (isMobile) {
				setCreatorName('Default Creator Name')
			}
		} else if (name === 'creatorDescription') {
			setCreatorDescription(value)
			if (isMobile) {
				setCreatorDescription('Default Creator Description')
			}
		} else if (name === 'twitter') {
			setTwitter(value)
			if (isMobile) {
				setTwitter('Default Twitter')
			}
		} else if (name === 'farcaster') {
			setFarcaster(value)
			if (isMobile) {
				setFarcaster('Default Farcaster')
			}
		} else if (name === 'revenueShare') {
			if (value === 'custom') {
				setRevShare('')
				setIsCustomSelected(true)
			} else {
				setRevShare(value)
				setIsCustomSelected(false)
			}
		} else if (name === 'customRevShare') {
			if (value === '' || /^\d+$/.test(value)) {
				const numValue = parseInt(value)
				if (value === '' || (numValue >= 0 && numValue <= 100)) {
					setCustomRevShare(value)
					setRevShare(value === '' ? '' : numValue)
				}
			}
		} else if (name === 'license') {
			setLicense(value)
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

	// checking unsupported chain for individual networks
	const isUnsupportedChain = () => {
		if (chainId !== storyMainnet.id && !isSuccessSwitchNetwork) return true
	}

	// mint on Zora
	const handleSubmit = () => {
		console.log('handleSubmit')
		if (!address) {
			toast.error('Please connect your wallet')
			return
		}
		if (!isAuthenticated) {
			toast.error('Please login to continue')
			return
		}

		if (!isConnected) {
			toast.error('Please connect your wallet')
			return
		}

		if (contextCanvasIdRef.current === null) {
			toast.error('Please select a design')
			return
		}

		// check if collection name is provided
		if (!collectionName) {
			toast.error('Please provide a collection name')
			return
		}

		// check if creator name is provided
		if (!creatorName) {
			toast.error('Please provide a creator name')
			return
		}

		// check if creator description is provided
		if (!creatorDescription) {
			toast.error('Please provide a creator description')
			return
		}

		// check if description is provided
		if (!postDescription) {
			toast.error('Please provide a description')
			return
		}

		console.log('handleSubmit', 'mutate')

		// upload to IPFS
		mutate(canvasBase64Ref.current[0])
	}

	const isLoading = isUploading || isUploadIPPending || isUploadPending

	return (
		<div>
			<div className=" mt-1 pt-2 pb-4">
				<div className="flex justify-between">
					<h2 className="text-lg">IP Registration Details </h2>
				</div>
			</div>

			<div className="flex flex-col w-full gap-3">
				<div className="flex flex-col gap-2">
					<h3 className="text-md">IP Details</h3>
					<div className="flex flex-col w-full">
						<InputBox
							label="Name"
							name="title"
							disabled={isLoading}
							onChange={(e) => handleInputChange(e)}
							onFocus={(e) => handleInputChange(e)}
							value={collectionName}
						/>
						<div className="mt-4">
							{!isMobile ? (
								<Textarea
									label="Description"
									name="description"
									disabled={isLoading}
									onChange={(e) => handleInputChange(e)}
									onFocus={(e) => handleInputChange(e)}
									value={postDescription}
								/>
							) : (
								<textarea
									cols={30}
									type="text"
									className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
									label="Description"
									name="description"
									onChange={(e) => handleInputChange(e)}
									onFocus={(e) => handleInputChange(e)}
									value={postDescription}
									placeholder="Write a description..."
									// className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
								/>
							)}
							{charLimitError && <div className="text-red-500 text-sm">{charLimitError}</div>}
						</div>

						<div className="mt-4">
							<SelectBox
								options={licenseOptions.map((option) => ({
									...option,
									value: option.value.toString(),
								}))}
								onChange={(e) => handleInputChange(e)}
								name="license"
								label="License"
							/>
						</div>

						{license === getPILTypeString(2) && (
							<div className="mt-4">
								<SelectBox
									options={revenueShareOptions}
									onChange={(e) => handleInputChange(e)}
									name="revenueShare"
									label="Remix Royalties"
									value={isCustomSelected ? 'custom' : revShare.toString()}
								/>
								{isCustomSelected && (
									<div className="mt-2">
										<InputBox
											label="Custom Remix Royalties (%)"
											name="customRevShare"
											type="text"
											min="0"
											max="100"
											disabled={isLoading}
											onChange={(e) => handleInputChange(e)}
											value={customRevShare}
											placeholder="Enter value between 0-100"
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col mt-2 gap-2">
					<h3 className="text-md">Creator Details</h3>
					<div className="flex flex-col w-full">
						<InputBox
							label="Creator Name"
							name="creatorName"
							disabled={isLoading}
							onChange={(e) => handleInputChange(e)}
							onFocus={(e) => handleInputChange(e)}
							value={creatorName}
						/>
						<div className="mt-4">
							{!isMobile ? (
								<Textarea
									label="Creator Description"
									name="creatorDescription"
									disabled={isLoading}
									onChange={(e) => handleInputChange(e)}
									onFocus={(e) => handleInputChange(e)}
									value={creatorDescription}
								/>
							) : (
								<textarea
									cols={30}
									type="text"
									className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
									label="Creator Description"
									name="creatorDescription"
									onChange={(e) => handleInputChange(e)}
									onFocus={(e) => handleInputChange(e)}
									value={creatorDescription}
									disabled={isLoading}
									placeholder="Write a description..."
									// className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
								/>
							)}
							{charLimitError && <div className="text-red-500 text-sm">{charLimitError}</div>}
						</div>
						<div className="flex mt-2s">
							<InputBox
								label="Twitter"
								name="twitter"
								disabled={isLoading}
								onChange={(e) => handleInputChange(e)}
								onFocus={(e) => handleInputChange(e)}
								value={twitter}
							/>
						</div>
						<div className="flex mt-4">
							<InputBox
								label="Farcaster"
								name="farcaster"
								disabled={isLoading}
								onChange={(e) => handleInputChange(e)}
								onFocus={(e) => handleInputChange(e)}
								value={farcaster}
							/>
						</div>
					</div>
				</div>
			</div>
			{isUploadIPSuccess && ipResult ? (
				<div className="flex flex-col gap-2 mt-4 justify-center items-center">
					<p className="text-green-500 font-bold">IP registered successfully!</p>
					<p className="font-bold text-lg mt-3">Share IP on Social Platforms</p>
					<div className="flex items-center gap-5">
						<Button className="font-medium" onClick={() => setMenu('xshare')}>
							Share on X
						</Button>
						<Button className="font-medium" onClick={() => setMenu('farcasterShare')}>
							Share on Farcaster
						</Button>
					</div>
					<a
						href={`${storyMainnet?.blockExplorers?.default.url}/tx/${ipResult.txHash}`}
						className="text-purple-500 hover:underline"
						rel="noreferrer"
						target="_blank"
					>
						View transaction details
					</a>
				</div>
			) : !getEVMAuth ? (
				<EVMWallets title="Login with EVM" login={login} className="w-[97%]" />
			) : isUnsupportedChain() ? (
				<div className="outline-none mt-4">
					<Button
						className="w-full outline-none flex justify-center items-center gap-2"
						disabled={isLoadingSwitchNetwork}
						loading={isLoadingSwitchNetwork}
						onClick={() => switchChain({ chainId: storyMainnet.id })}
						color="red"
					>
						{isLoadingSwitchNetwork ? 'Switching' : 'Switch'} to {storyMainnet.name} Network {isLoadingSwitchNetwork && <Spinner />}
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<div className="mt-4">
						<p className="text-end mt-4">
							<span>Topup account:</span>
							{isWalletLoading || isWalletRefetching ? (
								<span className="text-blue-500"> Loading address... </span>
							) : (
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => {
										navigator.clipboard.writeText(walletData?.publicAddress)
										toast.success('Copied topup account address')
									}}
								>
									{' '}
									{addressCrop(walletData?.publicAddress)}
								</span>
							)}
						</p>
						<p className="text-end">
							<span>Topup balance:</span>
							{isWalletLoading || isWalletRefetching ? (
								<span className="text-blue-500"> Loading balance... </span>
							) : (
								<span>
									{' '}
									{walletData?.balance} {storyMainnet?.nativeCurrency?.symbol}{' '}
								</span>
							)}
						</p>
					</div>
					{walletData?.publicAddress && (
						<Topup
							topUpAccount={walletData?.publicAddress}
							isIP={true}
							balance={walletData?.balance}
							refetchWallet={refetchWallet}
							sponsored={walletData?.sponsored}
						/>
					)}
					<div className="mt-4">
						<Button
							disabled={isLoading}
							fullWidth
							loading={isLoading}
							// color="yellow"
							onClick={handleSubmit}
						>
							{' '}
							{isLoading ? 'Registering...' : 'Register IP'}
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Minting
