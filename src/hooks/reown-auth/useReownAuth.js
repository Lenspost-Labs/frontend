import { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from '../../providers/context'
import { useSignMessage } from 'wagmi'
import { useMutation } from '@tanstack/react-query'
import { evmAuth, solanaAuth } from '../../services'
import { toast } from 'react-toastify'
import { getFromLocalStorage, saveToLocalStorage } from '../../utils'
import { LOCAL_STORAGE } from '../../data'
import * as Sentry from '@sentry/react'
import useAppUrl from '../app/useAppUrl'
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect, useWalletInfo } from '@reown/appkit/react'
import base58 from 'bs58'

const useReownAuth = () => {
	const { open: openReown, close: closeReown } = useAppKit()
	const { posthog, setText, setIsLoading, setSession, setOpenedLoginModal } = useContext(Context)
	const { disconnect } = useDisconnect()
	const { walletInfo } = useWalletInfo()
	const { urlQueryActionType } = useAppUrl()
	const { signMessageAsync } = useSignMessage()
	const [signature, setSignature] = useState('')
	const [isSolana, setIsSolana] = useState(false)
	const { address, caipAddress, isConnected, status, embeddedWalletInfo } = useAppKitAccount()

	const isAuthenticated = isConnected && address

	//console.log('useAppKitAccount', { address, caipAddress, signature, walletInfo, isConnected, status, embeddedWalletInfo })

	const { mutateAsync: evmAuthAsync } = useMutation({
		mutationKey: 'evmAuth',
		mutationFn: evmAuth,
	})

	const { mutateAsync: solanaAuthAsync } = useMutation({
		mutationKey: 'solanaAuth',
		mutationFn: solanaAuth,
	})

	const evmConnected = getFromLocalStorage(LOCAL_STORAGE.evmConnected)
	const { walletProvider } = useAppKitProvider('solana')

	async function onSolanaSignMessage() {
		try {
			if (!walletProvider || !address) {
				throw Error('user is disconnected')
			}
			const encodedMessage = new TextEncoder().encode('Sign the message to login')
			const signatureBuffer = await walletProvider.signMessage(encodedMessage)
			const signatureBase58 = base58.encode(signatureBuffer)
			setSignature(signatureBase58)
		} catch (err) {
			console.error('Signature error:', err)
			toast.error('Failed to sign message')
			disconnect()
		}
	}

	const handleSignMessage = async () => {
		try {
			const signature = await signMessageAsync({
				message: 'Sign the message to login',
			})
			setSignature(signature)
		} catch (error) {
			console.error('Signature error:', error)
			toast.error('Failed to sign message')
			disconnect()
		}
	}

	useEffect(() => {
		if (address && isConnected) {
			saveToLocalStorage(LOCAL_STORAGE.evmConnected, true)
		} else {
			setSignature('')
			setIsSolana(false)
			saveToLocalStorage(LOCAL_STORAGE.evmConnected, false)
		}
	}, [address, isConnected])

	useEffect(() => {
		const initializeSignature = async () => {
			if (caipAddress?.startsWith('solana:') && address && !signature && isConnected && evmConnected) {
				setIsSolana(true)
				return await onSolanaSignMessage()
			}
			if (address && !signature && isConnected && evmConnected) {
				setIsSolana(false)
				return await handleSignMessage()
			}
		}
		initializeSignature()
	}, [address, isConnected, signature, caipAddress, evmConnected])

	useEffect(() => {
		if (signature) {
			handleLogin()
		}
	}, [signature, evmConnected])

	const handleLogin = useCallback(async () => {
		if (signature && address && isConnected) {
			//console.log('Debug login values:', { signature, address, isConnected, isSolana }) // Add debug logging

			if (!address) {
				//console.error('No wallet address available')
				toast.error('Wallet address not found')
				return
			}
			const asyncRequest = isSolana ? solanaAuthAsync : evmAuthAsync
			let request = {
				signature: signature,
				walletAddress: address,
			}
			if (isSolana) {
				request.message = 'Sign the message to login'
			}

			//console.log('Request payload:', request)
			try {
				asyncRequest(request).then((res) => {
					//console.log('res', res)
					toast.success(`${urlQueryActionType === 'composer' ? 'Wallet connected' : 'Login successful'}`)
					saveToLocalStorage(LOCAL_STORAGE.evmAuth, true)
					saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt)
					saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime())
					saveToLocalStorage(LOCAL_STORAGE.userAddress, address)
					saveToLocalStorage(LOCAL_STORAGE.lensAuth, {
						profileId: res?.profileId,
						profileHandle: res?.profileHandle,
					})
					saveToLocalStorage(LOCAL_STORAGE.userId, res?.userId)
					Sentry.setUser({
						id: res?.userId,
					})
					setSession(res.jwt)
					setOpenedLoginModal(false)
					closeReown()
					posthog.identify(res?.userId, {
						evm_address: address,
					})
				})
			} catch (error) {
				//console.log('error by auth endpoint')
				//console.log(error)
				toast.error('Something went wrong')
				disconnect()
				closeReown()
				setIsLoading(false)
				setOpenedLoginModal(false)
				setText('')
			}
		} else {
			//console.log('error by reown')
			toast.error('Something went wrong')
			disconnect()
			closeReown()
			setIsLoading(false)
			setOpenedLoginModal(false)
			setText('')
		}
	}, [signature, address, isConnected, isSolana])

	const login = useCallback(() => {
		openReown('AllWallets')
	}, [openReown])

	return {
		login,
		isAuthenticated,
		// for reown auth
		openReown,
		closeReown,
	}
}

export default useReownAuth
