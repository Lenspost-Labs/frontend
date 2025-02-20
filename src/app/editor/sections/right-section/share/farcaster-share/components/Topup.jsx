import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../../../../../../providers/context'
import { Button, Card, List, ListItem, Spinner, Typography } from '@material-tailwind/react'

import { useEstimateFeesPerGas, useAccount, useSwitchChain } from 'wagmi'
import { base, baseSepolia, confluxESpace, morph } from 'wagmi/chains'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { http, parseEther } from 'viem'
import { toast } from 'react-toastify'
import { wagmiAdapter } from '../../../../../../../providers/EVM/EVMWalletProvider'
import { ENVIRONMENT } from '../../../../../../../services'
import { useAppAuth } from '../../../../../../../hooks/app'
import useReownAuth from '../../../../../../../hooks/reown-auth/useReownAuth'
import { gasFeeForDeployment, gasFeeForMint, gasFeeForOxSplitCreate, storyMainnet } from '../../../../../../../data'

const Topup = ({ topUpAccount, refetchWallet, balance, sponsored, isIP = false, isCustomCurrMintOption }) => {
	const { canvasBase64Ref, farcasterStates, setFarcasterStates, chainId } = useContext(Context)
	let chain_id = isIP ? storyMainnet?.id : chainId

	console.log('canvasBase64Ref', canvasBase64Ref?.current)

	const [extraPayForMints, setExtraPayForMints] = useState(null)
	const { chain } = useAccount()
	const { openReown } = useReownAuth()
	const { isAuthenticated } = useAppAuth()
	const { data: switchData, isLoading: switchLoading, isError: switchError, error: switchErrorData, switchChain } = useSwitchChain()

	const {
		data: feeData,
		isError: isFeeError,
		error: feeError,
		isLoading: isFeeLoading,
	} = useEstimateFeesPerGas({
		chainId: chain?.id,
		formatUnits: 'ether',
	})

	const allowedMints = Number(farcasterStates.frameData?.allowedMints)
	const isTopup = farcasterStates.frameData?.isTopup
	const selectedNetwork = farcasterStates?.frameData?.selectedNetwork
	const isCustomCurrMint = isCustomCurrMintOption || farcasterStates?.frameData?.isCustomCurrMint
	const TxFeeForDeployment = gasFeeForDeployment[chain?.id]
	const txFeeForMint = gasFeeForMint[chain?.id]
	const txFeeForOxSplitCreate = gasFeeForOxSplitCreate[chain?.id]
	const isCreatorSponsored = farcasterStates.frameData.isCreatorSponsored

	const numberOfExtraMints = allowedMints

	const payForMintsForCustomCurr = Number(
		3 * TxFeeForDeployment + // While deploying the contract there are 3 transactions simultaneously
			txFeeForOxSplitCreate
	)
		.toFixed(18)
		.toString()

	const payForMintsForSponsored = Number(
		txFeeForMint * numberOfExtraMints +
			3 * TxFeeForDeployment + // While deploying the contract there are 3 transactions simultaneously
			txFeeForOxSplitCreate
	)
		.toFixed(18)
		.toString()

	const numberOfPages = canvasBase64Ref?.current?.length
	const NumberOfPageMultiplyByTxFeeForDeployment = TxFeeForDeployment + txFeeForMint * numberOfPages

	wagmiAdapter.transports = {
		[isIP ? storyMainnet?.id : chain?.id]: http(),
	}

	const payForMints = isIP ? NumberOfPageMultiplyByTxFeeForDeployment : isCustomCurrMint ? payForMintsForCustomCurr : payForMintsForSponsored

	const isSufficientBalance = isIP
		? parseFloat(balance) >= payForMints // Fix: reversed the comparison
		: farcasterStates.frameData?.isSufficientBalance

	const { data, isPending, isSuccess, isError, error, sendTransaction } = useSendTransaction({ wagmiAdapter })

	const {
		data: txData,
		isError: isTxError,
		error: txError,
		isLoading: isTxLoading,
		isSuccess: isTxSuccess,
	} = useWaitForTransactionReceipt({
		hash: data,
	})

	const handleChange = (e, key) => {
		const { name, value } = e.target

		setFarcasterStates((prevState) => {
			// Create a new state based on the previous state
			const newState = {
				...prevState,
				frameData: {
					...prevState.frameData,
					[key]: value,
				},
			}
			return newState
		})
	}

	// change the frameData isTopup to true if transaction is success
	useEffect(() => {
		if (isTxSuccess) {
			setFarcasterStates({
				...farcasterStates,
				frameData: {
					...farcasterStates.frameData,
					isTopup: true,
				},
			})

			setTimeout(() => {
				refetchWallet()
			}, 2000)
		}
	}, [isTxSuccess])

	// check if the user has enough balance to pay for mints
	useEffect(() => {
		setFarcasterStates((prevState) => {
			const newState = { ...prevState }

			if (balance >= payForMints) {
				// balance is sufficient
				newState.frameData.isSufficientBalance = true
			} else {
				// balance is not sufficient

				if (payForMints - balance > 0) {
					setExtraPayForMints((payForMints - balance).toFixed(18).toString())
					newState.frameData.isSufficientBalance = false
				} else {
					newState.frameData.isSufficientBalance = true
				}
			}

			return newState
		})
	}, [farcasterStates.frameData.allowedMints, balance, isTopup])

	// get the error message
	useEffect(() => {
		if (isError) {
			console.log(error)
			toast.error(error?.message.split('\n')[0])
		} else if (isTxError) {
			console.log(txError)
			toast.error(txError?.message.split('\n')[0])
		}
	}, [isError, isTxError])

	// if (farcasterStates.frameData.isCreatorSponsored && chain?.id !== chainId) {
	//   return (
	//     <Card className="my-2">
	//       <List>
	//         <ListItem
	//           className="flex justify-between items-center gap-2"
	//           onClick={() => {
	//             !isAuthenticated
	//               ? login()
	//               : switchChain({
	//                   chainId: chainId,
	//                 });
	//           }}
	//         >
	//           <Typography variant="h6" color="blue-gray">
	//             {!isAuthenticated
	//               ? "Please connect your wallet for topup"
	//               : `Click here to switch to
	//             ${ENVIRONMENT === "production" ? "Base" : "BaseSepolia"} chain for
	//             Topup`}
	//           </Typography>
	//         </ListItem>
	//       </List>
	//     </Card>
	//   );
	// }

	if (farcasterStates.frameData.isCustomCurrMint && chain?.id !== selectedNetwork?.id) {
		return (
			<Card className="my-2">
				<List>
					<ListItem
						className="flex justify-between items-center gap-2"
						onClick={() =>
							switchChain({
								chainId: network?.id,
							})
						}
					>
						<Typography variant="h6" color="blue-gray">
							Click here to switch to {selectedNetwork?.name}
						</Typography>
					</ListItem>
				</List>
			</Card>
		)
	}

	if (isFeeLoading) {
		return (
			<Card className="my-2">
				<List>
					<ListItem className="flex justify-between items-center gap-2">
						<Spinner color="green" />
					</ListItem>
				</List>
			</Card>
		)
	}

	if (isFeeError) {
		return (
			<Card className="my-2">
				<List>
					<ListItem className="flex justify-between items-center gap-2">
						<Typography variant="h6" color="blue-gray">
							Error fetching gas price
						</Typography>
					</ListItem>
				</List>
			</Card>
		)
	}

	return (
		<Card className="my-2">
			<List>
				<ListItem className="flex-col items-end gap-2">
					{isSufficientBalance ? (
						<Typography variant="h6" color="green">
							Sufficient balance to sponsor the gas
						</Typography>
					) : !isAuthenticated ? (
						<>
							<Typography variant="h6" color="blue-gray">
								Please connect your wallet to topup
							</Typography>
							<Button onClick={() => openReown('AllWallets')}>Connect</Button>
						</>
					) : isCreatorSponsored && chain?.id !== chain_id ? (
						<>
							<Typography variant="h6" color="blue-gray">
								Switch chain to {selectedNetwork?.name} for Topup
							</Typography>
							<Button
								onClick={() =>
									switchChain({
										chainId: chain_id,
									})
								}
							>
								Switch chain
							</Button>
						</>
					) : (
						<>
							<Typography variant="h6" color="red">
								Insufficient balance please topup
							</Typography>

							<Typography variant="h6" color="blue-gray">
								{extraPayForMints ? extraPayForMints : payForMints}{' '}
								<>
									{isIP ? storyMainnet?.name : chain?.name} {isIP ? storyMainnet?.nativeCurrency?.symbol : chain?.nativeCurrency?.symbol}
								</>
							</Typography>

							<div className="w-full flex justify-between items-center">
								{isTxLoading || isPending ? (
									<div className="flex justify-start gap-2">
										<Typography variant="h6" color="blue-gray">
											{isPending ? 'Confirm transaction' : isTxLoading ? 'Confirming' : ''}
										</Typography>
										<Spinner color="green" />
									</div>
								) : (
									<div></div>
								)}

								{isTxSuccess ? (
									<Button color="green" size="sm" className="flex justify-end">
										Paid
									</Button>
								) : (
									<Button
										onClick={() =>
											sendTransaction({
												to: topUpAccount,
												chainId: chain?.id,
												value: extraPayForMints ? parseEther(extraPayForMints) : parseEther(payForMints),
											})
										}
										color="green"
										size="sm"
										className="flex justify-end"
									>
										Pay
									</Button>
								)}
							</div>
						</>
					)}
				</ListItem>
			</List>
		</Card>
	)
}

export default Topup
