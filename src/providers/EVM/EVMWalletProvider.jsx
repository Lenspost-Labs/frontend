import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
//import { polygon, mainnet, zora, optimism, base, polygonMumbai, baseSepolia, arbitrum, degen } from 'wagmi/chains'
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from '../../services'
import { cookieStorage, createStorage, http } from 'wagmi'
import { ham, og } from '../../data'

import { storyOdysseyTestnet } from '../../data/network/storyOdyssey'
import { WagmiProvider } from 'wagmi'

import { createAppKit } from '@reown/appkit/react'
import { polygon, mainnet, zora, optimism, base, polygonMumbai, baseSepolia, arbitrum, degen } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

export const solanaWeb3JsAdapter = new SolanaAdapter({
	wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
})

const projectId = WALLETCONNECT_PROJECT_ID

export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	projectId: WALLETCONNECT_PROJECT_ID,
	networks:
		ENVIRONMENT === 'production'
			? [solana, base, mainnet, zora, optimism, arbitrum, polygon, degen, ham, og, storyOdysseyTestnet]
			: [solana, solanaTestnet, solanaDevnet, base, baseSepolia, zora, optimism, arbitrum, polygonMumbai, polygon, degen, ham, og, storyOdysseyTestnet],

	transports: {
		[base.id]: http(),
		[mainnet.id]: http(),
		[zora.id]: http(),
		[optimism.id]: http(),
		[polygon.id]: http(),
		[degen.id]: http(),
		[ham.id]: http(),
		[og.id]: http(),
		[polygonMumbai.id]: http(),
		[baseSepolia.id]: http(),
		[arbitrum.id]: http(),
		[storyOdysseyTestnet.id]: http(),
	},
})

const metadata = {
	//optional
	name: 'Poster.fun',
	description: 'Poster.fun',
	url: 'https://poster.fun',
	icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

export const appKit = createAppKit({
	adapters: [wagmiAdapter, solanaWeb3JsAdapter],
	networks:
		ENVIRONMENT === 'production'
			? [solana, base, mainnet, zora, optimism, arbitrum, polygon, degen, ham, og, storyOdysseyTestnet]
			: [solana, solanaTestnet, solanaDevnet, base, baseSepolia, zora, optimism, arbitrum, polygonMumbai, polygon, degen, ham, og, storyOdysseyTestnet],
	metadata: metadata,
	projectId,
	features: {
		analytics: true,
	},
})

const queryClient = new QueryClient()

const EVMWalletProvider = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
		</QueryClientProvider>
	)
}

export default EVMWalletProvider
