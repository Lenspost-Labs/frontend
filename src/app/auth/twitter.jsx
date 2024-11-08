import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveToLocalStorage } from '../../utils'
import { useEffect } from 'react'
import { twitterAuthenticateCallback } from '../../services'
import { toast } from 'react-toastify'
import { LOCAL_STORAGE } from '../../data'

function TwitterCallback() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const oauth_token = searchParams.get('oauth_token')
	const oauth_verifier = searchParams.get('oauth_verifier')

	useEffect(() => {
		if (oauth_token && oauth_verifier) {
			saveToStorage(oauth_token, oauth_verifier)
		}
	}, [oauth_token, oauth_verifier])

	const saveToStorage = async (oauth_token, oauth_verifier) => {
		try {
			const res = await twitterAuthenticateCallback(oauth_token, oauth_verifier)
			if (res?.data && res?.data?.success) {
				saveToLocalStorage(LOCAL_STORAGE.twitterAuth, {
					userId: res?.data?.data?.userId,
					userName: res?.data?.data?.screenName,
					oauthToken: oauth_token,
					oauthVerifier: oauth_verifier,
				})
				navigate('/')
			} else if (res?.error) {
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error)
		}
	}
	// ... rest of your callback logic
}

export default TwitterCallback
