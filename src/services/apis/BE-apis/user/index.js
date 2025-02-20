import { API, api } from '../config'

// Get Details for a User

export const getUserProfile = async () => {
	const result = await api.get(`${API}/user`)
	return result?.data
}

export const getUserPoints = async (address) => {
	const result = await api.get(`${API}/points/total-points/${address}`)
	return result?.data
}
