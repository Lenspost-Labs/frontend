import { useContext } from 'react'
import { Context } from '../../providers/context'
import useReset from './useReset'
import * as Sentry from '@sentry/react'
import { useDisconnect } from '@reown/appkit/react'

const useLogout = () => {
	const { disconnect } = useDisconnect()
	const { posthog } = useContext(Context)
	const { resetState } = useReset()

	const logout = () => {
		localStorage.setItem('evmConnected', 'false')
		localStorage.clear()
		resetState()
		disconnect()
		solanaDisconnect()
		posthog.reset()
		Sentry.setUser(null)
	}

	return {
		logout,
	}
}

export default useLogout
