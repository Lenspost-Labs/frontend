import { useContext } from 'react'
import { Context } from '../../providers/context'
import useReset from './useReset'
import * as Sentry from '@sentry/react'
import { useDisconnect as useDisconnectReown } from '@reown/appkit/react'
import { useDisconnect } from 'wagmi'
import { saveToLocalStorage } from '../../utils'
import { LOCAL_STORAGE } from '../../data'

const useLogout = () => {
	const { disconnect } = useDisconnectReown()
	const { disconnect: disconnectWagmi } = useDisconnect()
	const { posthog, setIsLoggedOut } = useContext(Context)
	const { resetState } = useReset()

	const logout = () => {
		console.log('logout')
		setIsLoggedOut(true)
		disconnect()
		disconnectWagmi()
		//saveToLocalStorage(LOCAL_STORAGE.evmConnected, false)
		localStorage.clear()
		resetState()
		posthog.reset()
		Sentry.setUser(null)
	}

	return {
		logout,
	}
}

export default useLogout
