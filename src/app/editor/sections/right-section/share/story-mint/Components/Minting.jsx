import { useContext } from 'react'
import { Context } from '../../../../../../../providers/context'
import { useAppAuth, useReset } from '../../../../../../../hooks/app'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadJSONtoIPFS, uploadUserAssetToIPFS } from '../../../../../../../services'
import { toast } from 'react-toastify'
import useMint721 from '../../../../../../../hooks/mint721/useMint721'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { useEffect } from 'react'
import { getFromLocalStorage } from '../../../../../../../utils'
import { LOCAL_STORAGE, STORY_ODYSSEY_ADDRESS } from '../../../../../../../data'
import { storyOdysseyTestnet } from '../../../../../../../data/network/storyOdyssey'
import storyABI from '../../../../../../../data/json/storyABI.json'
import { InputBox } from '../../../../../common'
import { EVMWallets } from '../../../../top-section/auth/wallets'
import { Button } from '@material-tailwind/react'
import usePrivyAuth from '../../../../../../../hooks/privy-auth/usePrivyAuth'
import { Textarea } from '@material-tailwind/react'

const Minting = () => {
	const { postDescription, canvasBase64Ref, setPostDescription, contextCanvasIdRef } = useContext(Context)
	const { resetState } = useReset()
	const { login } = usePrivyAuth()
	const { isAuthenticated } = useAppAuth()
	const { address, isConnected } = useAccount()

	const {
		error: errorSwitchNetwork,
		isError: isErrorSwitchNetwork,
		isLoading: isLoadingSwitchNetwork,
		isSuccess: isSuccessSwitchNetwork,
		switchChain,
	} = useSwitchChain()

	const chainId = useChainId()

	const [collectionName, setCollectionName] = useState('')
	const [collectionSymbol, setCollectionSymbol] = useState('')

	const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth)

	const mintParams = () => {
		let params = {
			address: STORY_ODYSSEY_ADDRESS,
			chainId: storyOdysseyTestnet.id,
			args: [address, `ipfs://${uploadJSONData?.message}`],
			abi: storyABI,
			functionName: 'mint',
		}

		return params
	}

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

	// upload JSON to IPFS Mutation
	const {
		mutate: uploadJSONtoIPFSMutate,
		data: uploadJSONData,
		isError: isUploadJSONError,
		error: uploadJSONError,
		isSuccess: isUploadJSONSuccess,
		isLoading: isUploadingJSON,
		isPending: isUploadJSONPending,
	} = useMutation({
		mutationKey: 'uploadJSONtoIPFS',
		mutationFn: uploadJSONtoIPFS,
	})

	// upload JSON data to IPFS
	useEffect(() => {
		if (uploadData?.message) {
			const jsonData = {
				name: collectionName,
				symbol: collectionSymbol,
				description: postDescription,
				image: `ipfs://${uploadData?.message}`,
			}
			uploadJSONtoIPFSMutate(jsonData)
		}
	}, [isUploadSuccess])

	useEffect(() => {
		if (isUploadJSONError) {
			console.log(uploadJSONError)
			toast.error(uploadJSONError?.message)
		}
	}, [isUploadJSONError, uploadJSONError])

	useEffect(() => {
		if (isUploadError) {
			console.log(uploadError)
			toast.error(uploadError?.message)
		}
	}, [isUploadError, uploadError])

	const {
		tx: { isTxConfirming, isTxSuccess, isTxError, txError, txData },
		write: { isWriteError, writeError, isWriting, mint721 },
		simulation: { refetchSimulation },
	} = useMint721(mintParams())

	useEffect(() => {
		if (isTxSuccess) {
			console.log('isTxSuccess', txData)
			//resetState()
			toast.success('Collection minted successfully!')
		}
	}, [isTxSuccess, txData])

	useEffect(() => {
		if (isWriteError || isTxError) {
			const error = writeError || txError
			const errorMessage = error?.message?.split('\n')[0]
			if (errorMessage?.includes('connector not connected')) {
				toast.error('Please connect your wallet')
			} else {
				toast.error(errorMessage || 'An error occurred')
			}
		}
	}, [isWriteError, writeError, isTxError, txError])

	useEffect(() => {
		if (isUploadJSONSuccess) {
			mint721()
		}
	}, [isUploadJSONSuccess])
	// checking unsupported chain for individual networks
	const isUnsupportedChain = () => {
		if (chainId !== storyOdysseyTestnet.id && !isSuccessSwitchNetwork) return true
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

		// check if collection symbol is provided
		if (!collectionSymbol) {
			toast.error('Please provide a collection symbol')
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

	const isPending = isUploadPending || isUploadJSONPending

	const isLoading = isUploading || isUploadingJSON || isWriting || isTxConfirming

	return (
		<div>
			<div className=" mt-1 pt-2 pb-4">
				<div className="flex justify-between">
					<h2 className="text-lg"> Collection Details </h2>
				</div>
			</div>

			<div className={` `}>
				<div className="flex flex-col w-full py-2">
					<InputBox
						label="Collection Name"
						name="contractName"
						disabled={isLoading}
						onChange={(e) => setCollectionName(e.target.value)}
						onFocus={(e) => setCollectionName(e.target.value)}
						value={collectionName}
					/>

					<div className="mt-2">
						<InputBox
							label="Collection Symbol"
							name="contractSymbol"
							disabled={isLoading}
							onChange={(e) => setCollectionSymbol(e.target.value)}
							onFocus={(e) => setCollectionSymbol(e.target.value)}
							value={collectionSymbol}
						/>
					</div>
					<div className="mt-2">
						<Textarea
							label="Description"
							name="description"
							disabled={isLoading}
							onChange={(e) => setPostDescription(e.target.value)}
							onFocus={(e) => setPostDescription(e.target.value)}
							value={postDescription}
						/>
					</div>
				</div>
			</div>
			{isTxSuccess && txData ? (
				<div className="flex flex-col gap-2 justify-center items-center">
					<p className="text-green-500">Collection minted successfully!</p>
					<a
						href={`${storyOdysseyTestnet?.blockExplorers?.default.url}/tx/${txData?.transactionHash}`}
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
				<div className="outline-none">
					<Button
						className="w-full outline-none flex justify-center items-center gap-2"
						disabled={isLoadingSwitchNetwork}
						loading={isLoadingSwitchNetwork}
						onClick={() => switchChain({ chainId: storyOdysseyTestnet.id })}
						color="red"
					>
						{isLoadingSwitchNetwork ? 'Switching' : 'Switch'} to {storyOdysseyTestnet.name} Network {isLoadingSwitchNetwork && <Spinner />}
					</Button>
				</div>
			) : (
				<div className="">
					<Button
						disabled={isPending || isUnsupportedChain() || isLoading}
						fullWidth
						loading={isLoading}
						// color="yellow"
						onClick={handleSubmit}
					>
						{' '}
						{isLoading ? 'Minting...' : 'Mint IP'}
					</Button>
				</div>
			)}
		</div>
	)
}

export default Minting
