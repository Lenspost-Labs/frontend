import { Button, Dialog, DialogBody, DialogHeader, Spinner, Typography } from '@material-tailwind/react'
import BiCopy from '@meronex/icons/bi/BiCopy'
import BsBoxArrowUpRight from '@meronex/icons/bs/BsBoxArrowUpRight'
import { useContext, useEffect, useState } from 'react'
import { http } from 'viem'
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { APP_ETH_ADDRESS } from '../../../../data'
import { useUser } from '../../../../hooks/user'
import { wagmiAdapter } from '../../../../providers/EVM/EVMWalletProvider'
import { apiBuySubscription, ENVIRONMENT } from '../../../../services'
import Networks from './Networks'
import coinImg from '../../../../assets/svgs/Coin.svg'
import { base, baseSepolia, optimism, polygon } from 'viem/chains'
import { useAppAuth } from '../../../../hooks/app'
import { Context } from '../../../../providers/context'
import { CheckIcon, RefreshCcw, Sparkles } from 'lucide-react'
import useWriteContractWithTracking from '../../../../hooks/useWriteContractWithTracking/useWriteContractWithTracking'

const USDC_ADDRESSES = {
	8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base
	84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7c', // Base Sepolia
	10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Optimism
	137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon
}

const Packages = [
	{
		name: 'Basic',
		price: '3',
		priceETH: '0.001',
		amount: '30',
	},
	{
		name: 'Standard',
		price: '6',
		priceETH: '0.002',
		amount: '60',
	},
	{
		name: 'Premium',
		price: '9',
		priceETH: '0.003',
		amount: '90',
	},
]

const SparklingCoin = () => {
	return (
		<div className="coin">
			<div className="front jump">
				<div className="star"></div>
				<span className="currency">$</span>
				<div className="shapes">
					<div className="shape_l"></div>
					<div className="shape_r"></div>
					<span className="top">Poster</span>
					<span className="bottom">Gold</span>
				</div>
			</div>
			<div className="shadow"></div>
		</div>
	)
}

const BackgroundDecorations = () => {
	const decorations = [...Array(20)].map((_, i) => ({
		id: i,
		left: `${Math.random() * 100}%`,
		top: `${Math.random() * 100}%`,
		scale: 0.5 + Math.random() * 0.3,
		delay: Math.random() * 2,
	}))

	return (
		<div className="absolute z-[999] inset-0 overflow-hidden pointer-events-none">
			{decorations.map((dec) => (
				<div
					key={dec.id}
					className="absolute animate-float"
					style={{
						left: dec.left,
						top: dec.top,
						transform: `scale(${dec.scale})`,
						animation: `float 3s ease-in-out infinite ${dec.delay}s`,
						opacity: '0.1',
					}}
				>
					<img src={coinImg} alt="" className="w-4 h-4" />
				</div>
			))}
		</div>
	)
}

// Add USDC ABI for the transfer and approve functions
const USDC_ABI = [
	{
		type: 'function',
		name: 'approve',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'amount', type: 'uint256' },
		],
		outputs: [{ type: 'bool' }],
	},
	{
		type: 'function',
		name: 'transferFrom',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'sender', type: 'address' },
			{ name: 'recipient', type: 'address' },
			{ name: 'amount', type: 'uint256' },
		],
		outputs: [{ type: 'bool' }],
	},
	{
		type: 'function',
		name: 'transfer',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'recipient', type: 'address' },
			{ name: 'amount', type: 'uint256' },
		],
		outputs: [{ type: 'bool' }],
	},
]

const SubscriptionModal = ({ bottomBar = false, defaultOpen = false }) => {
	const { address, chainId, chain, isConnected } = useAccount()
	const { points } = useUser()
	const { isMobile } = useContext(Context)
	const { data: hash, error, isPending, sendTransaction } = useSendTransaction({ wagmiAdapter })

	const [openedSubscriptionModal, setOpenedSubscriptionModal] = useState(defaultOpen)
	const [isChainSupported, setIsChainSupported] = useState(true)
	const handleSubscriptionModal = () => {
		setOpenedSubscriptionModal(!openedSubscriptionModal)
	}
	const [selectedSubscription, setSelectedSubscription] = useState('30')
	const {
		data: balance,
		refetch: refetchBalance,
		isLoading: isLoadingBalance,
		isRefetching: isRefetchingBalance,
		isFetched: isFetchedBalance,
	} = useBalance({ address, token: USDC_ADDRESSES[chainId] })

	wagmiAdapter.transports = {
		[chainId]: http(),
	}

	// Get the selected package's USDC price
	const selectedPackage = Packages.find((pkg) => pkg.amount === selectedSubscription)
	const usdcAmount = parseFloat(selectedPackage.price)

	// Convert USDC amount to wei (USDC has 6 decimals)
	const usdcValue = BigInt(usdcAmount * 1_000_000) // 1 USDC = 1_000_000 units

	const transferParams = () => {
		let params = {
			address: USDC_ADDRESSES[chainId],
			args: [APP_ETH_ADDRESS, usdcValue],
			abi: USDC_ABI,
			functionName: 'transfer',
		}

		return params
	}

	const {
		tx: {
			isTxConfirming: isTxConfirmingTransfer,
			isTxSuccess: isTxSuccessTransfer,
			isTxError: isTxErrorTransfer,
			txError: txErrorTransfer,
			txData: txDataTransfer,
		},
		write: {
			isWriteError: isWriteErrorTransfer,
			writeError: writeErrorTransfer,
			isWriting: isWritingTransfer,
			writeData: writeDataTransfer,
			writeContract: writeContractTransfer,
		},
		simulation: { refetchSimulation: refetchSimulationTransfer },
	} = useWriteContractWithTracking(transferParams())

	const supportedChains = [optimism, base, polygon]

	useEffect(() => {
		if (isWriteErrorTransfer) {
			console.log(`isWriteErrorTransfer`, writeErrorTransfer)
		}
	}, [isWriteErrorTransfer, writeErrorTransfer])

	useEffect(() => {
		if (isWritingTransfer) {
			console.log(`isWritingTransfer`, isWritingTransfer)
		}
	}, [isWritingTransfer])

	useEffect(() => {
		if (isTxSuccessTransfer && writeDataTransfer) {
			console.log(`isTxSuccessTransfer`, isTxSuccessTransfer)
			console.log(`writeDataTransfer`, writeDataTransfer)
			fnCallBuyApi({ txHash: writeDataTransfer })
		}
	}, [isTxSuccessTransfer, writeDataTransfer])

	const fnCheckUnsupportedChain = () => {
		const isSupported = supportedChains.some((supChain) => chainId === supChain.id)
		setIsChainSupported(isSupported)
	}

	const {
		data: txData,
		isLoading: isConfirming,
		isSuccess: isConfirmed,
	} = useWaitForTransactionReceipt({
		hash,
	})

	const fnCallBuyApi = async ({ txHash }) => {
		console.log(`Txdata `)
		// console.log(txData);
		const buyRes = await apiBuySubscription({
			txHash: txHash,
			chainId: chainId,
			evm_address: address,
		})

		console.log(buyRes)
	}
	const fnBuyPoster = async () => {
		console.log(`in switch chain chain ${chain}`)

		try {
			// First, approve the contract to spend USDC
			writeContractTransfer()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	useEffect(() => {
		fnCheckUnsupportedChain()
	}, [chainId])

	const explorer_url =
		chain?.id === 8453
			? 'https://basescan.org'
			: chain?.id === 84532
			? 'https://base-sepolia.blockscout.com'
			: chain?.id === 10
			? 'https://optimistic.etherscan.io'
			: chain?.id === 137
			? 'https://polygonscan.com'
			: 'https://polygonscan.com'

	if (!isConnected) {
		return null
	}
	return (
		<>
			{!bottomBar ? (
				<div
					onClick={handleSubscriptionModal}
					className="cursor-pointer bg-black flex items-center gap-2 text-lg border-0 font-bold px-3 py-0  my-1 group rounded-md hover:bg-[#e1f16b]"
				>
					<img className="h-4 w-4 -mt-1" src={coinImg} alt="" />
					<div className="text-md group-hover:text-black text-white">{points}</div>
					<div className="text-sm font-normal group-hover:text-black text-white">Gold</div>
				</div>
			) : (
				<div onClick={handleSubscriptionModal} className={`absolute cursor-pointer ${isMobile ? 'bottom-16 right-24' : 'bottom-24 right-16'}`}>
					<SparklingCoin />
				</div>
			)}
			<Dialog
				className={`p-4 relative  max-h-[90vh] ${isMobile ? 'h-[90vh] overflow-hidden' : ''}`}
				size="md"
				open={openedSubscriptionModal}
				handler={handleSubscriptionModal}
			>
				<BackgroundDecorations />
				<DialogHeader className="justify-between">
					<div className="flex items-center gap-2">
						<Typography variant="h5" className="text-black font-bold">
							Choose your Poster Gold Subscription
						</Typography>
					</div>
					<div className="flex items-center gap-5">
						<div className="flex items-center gap-2">
							<span className="ml-1 flex gap-1 text-sm font-bold">
								<span className="text-black">Balance:</span>
								<span className="text-gray-800">{points}</span>
								<span className="text-[#b9cd1e]">Gold</span>
							</span>
						</div>
						<button className="text-red-500 hover:text-black" onClick={handleSubscriptionModal}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</DialogHeader>
				<DialogBody className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e1f16b] scrollbar-track-[#e1f16b]/50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full pr-4">
					<div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[#e1f16b]/40 to-white">
						<h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
							<Sparkles className="text-black w-6 h-6" /> Unlock Poster Gold Benefits!
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-1">
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Create AI masterpieces in HD</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Make backgrounds vanish instantly</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Save designs locally</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Auto-save your work</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Remove watermarks</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-500">
									<CheckIcon />
								</span>
								<span className="text-sm font-semibold text-gray-800">Access exclusive token drops</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{Packages.map((pkg) => (
							<div
								key={pkg.name}
								onClick={() => setSelectedSubscription(pkg.amount)}
								className={`cursor-pointer relative group transition-all duration-300 ${
									selectedSubscription === pkg.amount ? 'border-2 border-[#e1f16b]' : 'border border-gray-200'
								} rounded-xl`}
							>
								<div
									className={`h-full w-full rounded-xl p-4 sm:p-6 ${
										selectedSubscription === pkg.amount ? 'bg-[#e1f16b]/15' : 'bg-white hover:bg-[#e1f16b]/10'
									}`}
								>
									<div className="flex flex-col items-center text-center gap-3 sm:gap-4">
										<h3 className="text-lg sm:text-xl font-bold text-gray-800">{pkg.name}</h3>
										<div
											className={`rounded-full px-3 py-1 font-semibold text-sm sm:text-md ${
												selectedSubscription === pkg.amount ? 'bg-[#e1f16b] text-black' : 'text-[#b9cd1e] bg-[#e1f16b]/20'
											}`}
										>
											{pkg.amount} Gold
										</div>
										<div className="px-0 py-0 w-full">
											<div className={`text-lg sm:text-xl font-bold ${selectedSubscription === pkg.amount ? 'text-[#b9cd1e]' : 'text-gray-800'}`}>
												${pkg.price}.00 USDC
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{isPending && (
						<div className="flex items-center justify-center mt-4 gap-2">
							Please confirm the Transaction in your wallet <Spinner />
						</div>
					)}
					{isFetchedBalance && (
						<>
							{balance?.value < usdcValue ? (
								<div className="mt-4 flex items-center justify-center gap-2 text-red-500">
									<span>You don't have enough balance to buy Poster Gold </span>
									<Button
										className=" bg-[#e1f16b] hover:bg-[#e1f16b]/90  flex items-center gap-1 text-black px-2 py-1 rounded-md"
										disabled={isLoadingBalance || isRefetchingBalance}
										onClick={refetchBalance}
										loading={isLoadingBalance || isRefetchingBalance}
									>
										Refresh <RefreshCcw className="w-3 h-3" color="black" />
									</Button>
								</div>
							) : (
								<div className="mt-4 flex items-center gap-2">
									<span className="text-black font-semibold text-sm">Balance: {balance?.formatted} USDC </span>
									<Button
										className="bg-[#e1f16b] hover:bg-[#e1f16b]/90  flex items-center gap-1 text-black px-2 py-1 rounded-md"
										disabled={isLoadingBalance || isRefetchingBalance}
										onClick={refetchBalance}
										loading={isLoadingBalance || isRefetchingBalance}
									>
										<RefreshCcw className="w-3 h-3" color="black" />
									</Button>
								</div>
							)}
						</>
					)}
					{isTxSuccessTransfer && writeDataTransfer && (
						<div className="mt-4 mb-0 flex gap-4 items-center cursor-pointer">
							Transaction: {writeDataTransfer.slice(0, 16)}... <BiCopy onClick={() => navigator?.clipboard?.writeText(writeDataTransfer)} />
							<BsBoxArrowUpRight onClick={() => window?.open(`${explorer_url}/tx/${writeDataTransfer}`)} />
						</div>
					)}

					{isConfirming && <div className="mt-4">Waiting for Transaction confirmation...</div>}
					{isConfirmed && <div className="mt-4 font-medium text-green-500">We've received your transaction, You'll get Poster Gold soon</div>}
					{error && <div className="mt-4 text-red-500 text-xs">Transaction failed: {error.message}</div>}
					{/* {chain?.id !== 84532 && (
            <div className="m-4 text-red-500">
              Please switch to Base Sepolia to buy $POSTER
            </div>
          )} */}
					<div className="flex flex-row justify-between gap-3 mt-4">
						<div className="flex justify-center items-center gap-2">
							<span className="text-sm font-bold text-red-500">Current Network</span>
							<Networks chains={supportedChains} isUnsupportedChain={!isChainSupported} />
						</div>
						<div className="flex justify-center">
							<Button
								disabled={isPending || isTxConfirmingTransfer || balance?.value < usdcValue}
								onClick={fnBuyPoster}
								size="lg"
								className="w-auto focus:outline-none outline-none bg-[#e1f16b] hover:bg-[#e1f16b]/90 text-white py-3 rounded-xl transition-colors"
							>
								{isPending || isTxConfirmingTransfer ? (
									<div className="flex items-center text-black justify-center gap-2">
										<Spinner className="h-4 w-4" color="black" /> Processing...
									</div>
								) : (
									<div className="flex items-center justify-center gap-2 text-black text-lg font-semibold">
										Get Poster Gold <img src={coinImg} alt="" className="w-5 h-5" />
									</div>
								)}
							</Button>
						</div>
					</div>
				</DialogBody>
			</Dialog>
		</>
	)
}

export default SubscriptionModal
