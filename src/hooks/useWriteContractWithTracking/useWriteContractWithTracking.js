import { useWaitForTransactionReceipt, useSimulateContract, useWriteContract } from 'wagmi'

const useWriteContractWithTracking = (mintParams) => {
	const {
		refetch: refetchSimulation,
		isError: isSimulateError,
		isLoading: isSimulating,
		error: simulateError,
		data: simulateData,
	} = useSimulateContract(mintParams)

	const { writeContract: handleWriteContract, isError: isWriteError, isPending: isWriting, error: writeError, data: writeData } = useWriteContract()

	const {
		isLoading: isTxConfirming,
		isSuccess: isTxSuccess,
		isError: isTxError,
		error: txError,
		data: txData,
	} = useWaitForTransactionReceipt({
		hash: writeData,
	})

	const writeContract = () => {
		handleWriteContract(mintParams)
	}

	return {
		simulation: {
			refetchSimulation,
			isSimulateError,
			simulateError,
			isSimulating,
			simulateData,
		},
		write: {
			isWriteError,
			writeError,
			isWriting,
			writeData,
			writeContract,
		},
		tx: {
			isTxConfirming,
			isTxSuccess,
			isTxError,
			txError,
			txData,
		},
	}
}

export default useWriteContractWithTracking
