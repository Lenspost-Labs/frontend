import { LOCAL_STORAGE } from '../../data'
import { getFromLocalStorage } from '../../utils'

const useAppAuth = () => {
	const isAuthenticated = getFromLocalStorage(LOCAL_STORAGE.userAuthToken) || getFromLocalStorage(LOCAL_STORAGE.FcComposerAuth)

	return { isAuthenticated }
}

export default useAppAuth
