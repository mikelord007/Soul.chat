<script lang="ts">
	import '../app.css';
	import Borders from '$lib/components/Borders/index.svelte';
	import { configureChains, createClient } from '@wagmi/core';
	import { polygonMumbai } from '@wagmi/core/chains';
	import { Web3Modal } from '@web3modal/html';
	import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
	import { networkConnectionData, deviceSize } from '$lib/stores';
	import { onMount } from 'svelte';

	const borderWidth = $deviceSize.size === '2xl' ? '0.85rem' : undefined;
	const borderHeight = $deviceSize.size === '2xl' ? '0.85rem' : undefined;

	let ethereumClient: undefined | EthereumClient;
	let web3Modal: undefined | Web3Modal;
	const chains = [polygonMumbai];

	const initializeWalletConnection = () => {
		// Wagmi Core Client
		const { provider } = configureChains(chains, [
			walletConnectProvider({ projectId: '19fac367aa0adcaefbf87fcf1af1c140' })
		]);

		const wagmiClient = createClient({
			autoConnect: true,
			connectors: modalConnectors({ appName: 'SoulChat', chains }),
			provider
		});

		// Web3Modal and Ethereum Client
		ethereumClient = new EthereumClient(wagmiClient, chains);

		web3Modal = new Web3Modal({ projectId: '19fac367aa0adcaefbf87fcf1af1c140' }, ethereumClient);

		web3Modal.setTheme({
			themeMode: 'dark',
			themeColor: 'blackWhite',
			themeBackground: 'gradient'
		});
	};

	const setWalletStatusInStore = () => {
		const correctNetwork = ethereumClient?.getNetwork().chain?.id === polygonMumbai.id;
		const walletConnected = ethereumClient?.getAccount().isConnected ? true : false;
		networkConnectionData.update((prev) => ({ ...prev, walletConnected, correctNetwork }));
	};

	const addWalletDataToStore = () => {
		networkConnectionData.update((prev) => ({
			...prev,
			ethereumClient,
			web3Modal
		}));
	};

	onMount(() => {
		initializeWalletConnection();

		setWalletStatusInStore();

		addWalletDataToStore();

		ethereumClient?.watchNetwork(() => {
			setWalletStatusInStore();
		});

		ethereumClient?.watchAccount(() => {
			setWalletStatusInStore();
		});
	});
</script>

<div class="min-h-screen">
	<Borders
		needOverflowSupport
		width={borderWidth}
		height={borderHeight}
		isFixed={true}
		applyZIndex={true}
	/>
	<slot />
</div>
