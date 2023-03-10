<script lang="ts">
	import '../app.css';
	import Borders from '$lib/components/Borders/index.svelte';
	import { configureChains, createClient, fetchEnsName, readContract } from '@wagmi/core';
	import { polygonMumbai, mainnet } from '@wagmi/core/chains';
	import { Web3Modal } from '@web3modal/html';
	import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
	import { networkConnectionData, deviceSize } from '$lib/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { SOULTOKENADDRESS } from '$lib/constants/index';
	import { abi as SOULTOKENABI } from '$lib/constants/abi';
	import type { BigNumber } from 'ethers';

	const borderWidth = $deviceSize.size === '2xl' ? '0.85rem' : undefined;
	const borderHeight = $deviceSize.size === '2xl' ? '0.85rem' : undefined;

	let ethereumClient: undefined | EthereumClient;
	let web3Modal: undefined | Web3Modal;
	let myAddress: undefined | `0x${string}`;
	let myENS: undefined | string;
	let myRewards: undefined | string;
	const chains = [polygonMumbai, mainnet];

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
		web3Modal.setSelectedChain(polygonMumbai);

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

	const addWalletDataToStore = async () => {
		myAddress = ethereumClient?.getAccount().address;

		if (myAddress) {
			myENS = await fetchEnsName({
				address: myAddress,
				chainId: 1
			});

			const data: BigNumber = await readContract({
				address: SOULTOKENADDRESS,
				abi: SOULTOKENABI,
				functionName: 'rewardCount',
				args: [myAddress]
			});
			myRewards = data.toString();
		}

		networkConnectionData.update((prev) => ({
			...prev,
			ethereumClient,
			web3Modal,
			myAddress,
			myENS,
			myRewards
		}));
	};

	const redirectIfNotAuthenticated = () => {
		const correctNetwork = ethereumClient?.getNetwork().chain?.id === polygonMumbai.id;
		const walletConnected = ethereumClient?.getAccount().isConnected ? true : false;

		if (!correctNetwork || !walletConnected) {
			if (browser && window.location.pathname !== '/') {
				goto('/');
			}
		}
	};

	onMount(() => {
		initializeWalletConnection();

		ethereumClient?.watchNetwork(() => {
			setWalletStatusInStore();
			redirectIfNotAuthenticated();
		});

		ethereumClient?.watchAccount(() => {
			setWalletStatusInStore();
			addWalletDataToStore();
			redirectIfNotAuthenticated();
		});
	});
</script>

<div>
	<Borders
		needOverflowSupport
		width={borderWidth}
		height={borderHeight}
		isFixed={true}
		applyZIndex={true}
	/>
	<slot />
</div>
