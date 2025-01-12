import { Button } from '@material-tailwind/react'
import React, { useCallback, useState } from 'react'
import { EVMLogo } from '../../../../../../assets'
import { evmAuth } from '../../../../../../services'
import { useMutation } from '@tanstack/react-query'
import { useAppKit } from '@reown/appkit/react'
import { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getFromLocalStorage, saveToLocalStorage } from '../../../../../../utils'
import { LOCAL_STORAGE } from '../../../../../../data'
import * as Sentry from '@sentry/react'
import useAppUrl from '../../../../../../hooks/app/useAppUrl'
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { Context } from '../../../../../../providers/context'
import { useSignMessage } from 'wagmi'

const EVMWallets = ({ title, className }) => {
	const { open, close } = useAppKit()
	const { signMessageAsync } = useSignMessage()
	const [signature, setSignature] = useState('')
	const { posthog, setText, setIsLoading, setSession, setOpenedLoginModal } = useContext(Context)
	const { disconnect } = useDisconnect()
	const { urlQueryActionType } = useAppUrl()
	const { address, isConnected, caipAddress, status } = useAppKitAccount()
	const { mutateAsync: evmAuthAsync } = useMutation({
		mutationKey: 'evmAuth',
		mutationFn: evmAuth,
	})
	const evmConnected = getFromLocalStorage(LOCAL_STORAGE.evmConnected)

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
		saveToLocalStorage(LOCAL_STORAGE.evmConnected, true)
	}, [address, isConnected])

	useEffect(() => {
		const initializeSignature = async () => {
			if (address && isConnected && !signature && evmConnected) {
				await handleSignMessage()
			}
		}
		initializeSignature()
	}, [address, isConnected, signature, evmConnected])

	useEffect(() => {
		if (signature) {
			handleLogin()
		}
	}, [signature, evmConnected])

	const handleLogin = useCallback(async () => {
		if (signature && address && isConnected) {
			console.log('handleLogin', { connected: isConnected, address, signature, status })
			try {
				evmAuthAsync({
					walletAddress: address,
					signature: signature,
				}).then((res) => {
					console.log('res', res)
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

					posthog.identify(res?.userId, {
						evm_address: address,
					})
				})
			} catch (error) {
				console.log('error by auth endpoint')
				console.log(error)
				toast.error('Something went wrong')
				disconnect()
				setIsLoading(false)
				setOpenedLoginModal(false)
				setText('')
			}
		} else {
			console.log('error by privy')
			console.log(error)
			toast.error('Something went wrong')
			disconnect()
			setIsLoading(false)
			setOpenedLoginModal(false)
			setText('')
		}
	}, [signature, address, isConnected])
	return (
		<Button size="lg" color="black" className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`} onClick={() => open('AllWallets')}>
			<img src={EVMLogo} alt="evm" className="h-6 w-6 object-contain bg-cover" />
			{title}
		</Button>
	)
}

export default EVMWallets
