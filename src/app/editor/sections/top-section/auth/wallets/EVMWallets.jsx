import { Button } from '@material-tailwind/react'
import React from 'react'
import { EVMLogo } from '../../../../../../assets'
import useReownAuth from '../../../../../../hooks/reown-auth/useReownAuth'

const EVMWallets = ({ className }) => {
	const { openReown } = useReownAuth()

	return (
		<Button size="lg" color="black" className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`} onClick={() => openReown('AllWallets')}>
			Login
		</Button>
	)
}

export default EVMWallets
