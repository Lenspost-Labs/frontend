import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveToLocalStorage } from '../../utils'
import { useEffect } from 'react'
import { twitterAuthenticateCallback } from '../../services'
import { toast } from 'react-toastify'
import { LOCAL_STORAGE } from '../../data'
import { useContext } from 'react'
import { Context } from '../../providers/context'

function TwitterCallback() {
	const { setXAuth } = useContext(Context)
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
			console.log(res)
			if (res?.data?.success) {
				// saveToLocalStorage(LOCAL_STORAGE.twitterAuth, {
				// 	userId: res?.data?.data?.twitterUserId,
				// 	userName: res?.data?.data?.screenName,
				// 	oauthToken: oauth_token,
				// 	oauthVerifier: oauth_verifier,
				// })
				// setXAuth({
				// 	userId: res?.data?.data?.twitterUserId,
				// 	userName: res?.data?.data?.screenName,
				// 	oauthToken: oauth_token,
				// 	oauthVerifier: oauth_verifier,
				// })
				//navigate('/', { replace: true })
				window.close() // Add this line to close the window
			} else if (res?.error) {
				setXAuth(null)
				toast.error(res?.error)
			}
		} catch (error) {
			console.log(error)
		}
	}
	// ... rest of your callback logic
}

export default TwitterCallback
